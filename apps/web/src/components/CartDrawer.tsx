import { Link } from 'react-router-dom';
import { formatPrice } from '@arviora/shared';
import { useCart } from '../cart/useCart';

/**
 * Slide-out cart drawer (from the right) with a dimmed overlay.
 * Rendered globally so it's available on every page.
 */
export default function CartDrawer() {
  const {
    items,
    count,
    subtotalInPaise,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-96 max-w-[90vw] flex-col bg-canvas shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">
            Your cart
            {count > 0 && <span className="text-muted"> ({count})</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-surface ring-1 ring-line">
              <BagIcon />
            </div>
            <p className="text-sm text-muted">Your cart is empty.</p>
            <button
              onClick={closeCart}
              className="mt-1 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* Line items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={`${item.productId}:${item.size}`}
                    className="flex gap-3"
                  >
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="h-20 w-20 flex-none overflow-hidden rounded-xl bg-surface ring-1 ring-line"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="line-clamp-1 text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          aria-label="Remove item"
                          className="text-muted transition hover:text-ink"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        Size {item.size}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg bg-surface ring-1 ring-line">
                          <QtyButton
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            label="Decrease quantity"
                          >
                            −
                          </QtyButton>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <QtyButton
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            label="Increase quantity"
                          >
                            +
                          </QtyButton>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(
                            item.priceInPaise * item.quantity,
                            item.currency,
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-line px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(subtotalInPaise)}
                </span>
              </div>
              <p className="mb-4 text-xs text-muted">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <button
                className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:opacity-90"
                onClick={() => alert('Checkout is coming next!')}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function QtyButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-8 w-8 place-items-center text-base text-muted transition hover:text-ink"
    >
      {children}
    </button>
  );
}

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

const BagIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-muted"
    aria-hidden="true"
  >
    <path d="M6 8h12l-1 11H7L6 8Z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
);
