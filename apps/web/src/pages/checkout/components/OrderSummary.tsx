import { formatPrice } from '@arviora/shared';
import type { CartItem } from '../../../store/cartSlice';
import Spinner from '../../../components/Spinner';

interface OrderSummaryProps {
  items: CartItem[];
  subtotalInPaise: number;
  submitting: boolean;
}

const OrderSummary = ({
  items,
  subtotalInPaise,
  submitting,
}: OrderSummaryProps) => (
  <div className="rounded-2xl bg-surface p-6 ring-1 ring-line">
    <h2 className="font-display text-lg font-semibold">Order summary</h2>

    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li
          key={`${item.productId}:${item.size}`}
          className="flex items-center gap-3"
        >
          <div className="h-14 w-14 flex-none overflow-hidden rounded-lg bg-canvas ring-1 ring-line">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted">
              Size {item.size} · Qty {item.quantity}
            </p>
          </div>
          <span className="text-sm font-medium">
            {formatPrice(item.priceInPaise * item.quantity, item.currency)}
          </span>
        </li>
      ))}
    </ul>

    <div className="mt-5 border-t border-line pt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Subtotal</span>
        <span className="font-semibold">{formatPrice(subtotalInPaise)}</span>
      </div>
      <p className="mt-1 text-xs text-muted">
        Shipping &amp; taxes calculated on delivery.
      </p>
    </div>

    <button
      type="submit"
      disabled={submitting}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {submitting && <Spinner />}
      {submitting ? 'Placing order…' : 'Place order'}
    </button>
  </div>
);

export default OrderSummary;
