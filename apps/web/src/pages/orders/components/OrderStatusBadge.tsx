import type { OrderStatus } from '@arviora/shared';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STYLES[status]}`}
  >
    {status}
  </span>
);

export default OrderStatusBadge;
