import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatPrice, type Order } from '@arviora/shared';
import { fetchOrders } from '../../api/orders';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import OrderStatusBadge from './components/OrderStatusBadge';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const itemCount = (order: Order) =>
  order.items.reduce((n, i) => n + i.quantity, 0);

const Orders = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  return (
    <div className="min-h-screen">
      <TopBar>
        <CartButton />
      </TopBar>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          My orders
        </h1>

        {isLoading && <p className="mt-6 text-muted">Loading…</p>}
        {isError && (
          <p className="mt-6 text-red-600">Couldn’t load your orders.</p>
        )}

        {orders &&
          (orders.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="text-sm text-muted">
                You haven’t placed any orders yet.
              </p>
              <Link
                to="/"
                className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {formatDate(order.createdAt)} · {itemCount(order)} item
                        {itemCount(order) > 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(order.subtotalInPaise, order.currency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
      </main>
    </div>
  );
};

export default Orders;
