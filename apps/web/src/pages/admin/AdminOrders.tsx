import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { OrderStatus } from '@arviora/shared';
import { formatPrice } from '@arviora/shared';
import { fetchAdminOrders, updateOrderStatus } from '../../api/admin';
import { useToast } from '../../components/Toast';

const STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const ORDERS_KEY = ['admin-orders'];

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ORDERS_KEY,
    queryFn: fetchAdminOrders,
  });

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      toast('Order status updated', 'success');
    } catch {
      toast('Couldn’t update order status', 'error');
    }
  };

  if (isLoading) return <p className="text-muted">Loading…</p>;
  if (isError || !orders) {
    return <p className="text-red-600">Couldn’t load orders.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-5 py-3">Order</th>
            <th className="px-5 py-3">Customer</th>
            <th className="px-5 py-3">Total</th>
            <th className="px-5 py-3">Placed</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-muted">
                No orders yet.
              </td>
            </tr>
          )}
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-5 py-3 font-medium">
                #{order.id.slice(-6).toUpperCase()}
              </td>
              <td className="px-5 py-3 text-muted">
                {order.userName ?? '—'}
                {order.userEmail && (
                  <span className="block text-xs">{order.userEmail}</span>
                )}
              </td>
              <td className="px-5 py-3">
                {formatPrice(order.subtotalInPaise, order.currency)}
              </td>
              <td className="px-5 py-3 text-muted">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-3">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium outline-none transition focus:border-ink"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
