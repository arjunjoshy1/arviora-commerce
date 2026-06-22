import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import { formatPrice } from '@arviora/shared';
import { fetchOrder } from '../../api/orders';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import OrderStatusBadge from './components/OrderStatusBadge';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const OrderDetail = () => {
  const { id = '' } = useParams();
  const location = useLocation();
  const justPlaced = (location.state as { justPlaced?: boolean } | null)
    ?.justPlaced;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
  });

  return (
    <div className="min-h-screen">
      <TopBar>
        <Link
          to="/orders"
          className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
        >
          My orders
        </Link>
        <CartButton />
      </TopBar>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {isLoading && <p className="text-muted">Loading…</p>}
        {isError && <p className="text-red-600">Couldn’t load this order.</p>}

        {order && (
          <>
            {justPlaced && (
              <div className="mb-6 rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
                <p className="font-display text-lg font-semibold text-emerald-800">
                  Thank you! Your order is confirmed.
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  We’ll send updates as it’s processed.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  Order #{order.id.slice(-6).toUpperCase()}
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Placed {formatDate(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Items */}
            <div className="mt-6 rounded-2xl bg-surface ring-1 ring-line">
              <ul className="divide-y divide-line">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(
                        item.priceInPaise * item.quantity,
                        order.currency,
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-line px-5 py-4">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-sm font-semibold">
                  {formatPrice(order.subtotalInPaise, order.currency)}
                </span>
              </div>
            </div>

            {/* Shipping */}
            <div className="mt-6 rounded-2xl bg-surface p-5 ring-1 ring-line">
              <h2 className="text-sm font-semibold">Shipping to</h2>
              <div className="mt-2 text-sm text-muted">
                <p className="text-ink">{order.shipping.name}</p>
                <p>{order.shipping.phone}</p>
                <p>
                  {order.shipping.line1}
                  {order.shipping.line2 ? `, ${order.shipping.line2}` : ''}
                </p>
                <p>
                  {order.shipping.city}, {order.shipping.state}{' '}
                  {order.shipping.postalCode}
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="mt-8 inline-block text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              ← Continue shopping
            </Link>
          </>
        )}
      </main>
    </div>
  );
};

export default OrderDetail;
