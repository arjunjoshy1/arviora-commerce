import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '@arviora/shared';
import { fetchProduct } from '../api';
import Logo from '../components/Logo';
import CartButton from '../components/CartButton';
import { useCart } from '../cart/useCart';
import { useToast } from '../components/Toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const { addItem, openCart } = useCart();
  const toast = useToast();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
  });

  const handleAddToCart = () => {
    if (!product || !size) return;
    addItem(product, size, qty);
    toast(`Added ${product.name} (${size}) to cart`, 'success');
    openCart();
  };

  return (
    <div className="min-h-screen">
      {/* Slim header */}
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              ← Back to shop
            </Link>
            <CartButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {isLoading && <p className="text-muted">Loading…</p>}
        {isError && <p className="text-red-600">Couldn’t load this product.</p>}

        {product && (
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <div className="overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
              <div className="aspect-square">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="lg:py-2">
              <Link
                to="/"
                className="text-[11px] uppercase tracking-wide text-muted hover:text-ink"
              >
                {product.category.name}
              </Link>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-semibold">
                {formatPrice(product.priceInPaise, product.currency)}
              </p>

              <p className="mt-5 leading-relaxed text-muted">
                {product.description}
              </p>

              {/* Colour */}
              {product.color && (
                <div className="mt-6">
                  <span className="mb-2 block text-sm font-medium">Colour</span>
                  <span
                    className="inline-block h-8 w-8 rounded-full ring-1 ring-black/10 ring-offset-2 ring-offset-canvas"
                    style={{ backgroundColor: product.color }}
                    title={product.color}
                  />
                </div>
              )}

              {/* Size selector */}
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Select size</span>
                  <button className="text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`h-11 min-w-11 rounded-xl px-3 text-sm font-medium transition ${
                        size === s
                          ? 'bg-accent text-white'
                          : 'bg-surface ring-1 ring-line hover:ring-ink/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <span className="mb-2 block text-sm font-medium">Quantity</span>
                <div className="inline-flex items-center rounded-xl bg-surface ring-1 ring-line">
                  <QtyButton
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    label="Decrease quantity"
                    disabled={qty <= 1}
                  >
                    −
                  </QtyButton>
                  <span className="w-10 text-center text-sm font-medium">
                    {qty}
                  </span>
                  <QtyButton
                    onClick={() =>
                      setQty((q) => Math.min(product.stock, q + 1))
                    }
                    label="Increase quantity"
                    disabled={qty >= product.stock}
                  >
                    +
                  </QtyButton>
                </div>
                <span className="ml-3 text-xs text-muted">
                  {product.stock} in stock
                </span>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  disabled={!size}
                  className="flex-1 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {size ? 'Add to cart' : 'Select a size'}
                </button>
                <button className="rounded-xl bg-surface px-6 py-3.5 text-sm font-medium ring-1 ring-line transition hover:ring-ink/30">
                  ♡ Wishlist
                </button>
              </div>

              {/* Reassurance row */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center text-xs text-muted">
                <Perk title="Free delivery" sub="Orders over ₹999" />
                <Perk title="Easy returns" sub="7-day policy" />
                <Perk title="Secure checkout" sub="100% protected" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function QtyButton({
  onClick,
  label,
  disabled = false,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="grid h-10 w-10 place-items-center text-lg text-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-muted"
    >
      {children}
    </button>
  );
}

function Perk({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <p className="font-medium text-ink">{title}</p>
      <p>{sub}</p>
    </div>
  );
}
