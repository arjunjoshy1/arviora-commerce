import { Link } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import { useWishlist } from '../../wishlist/useWishlist';
import WishlistCard from './components/WishlistCard';

const Wishlist = () => {
  const { items, isLoading, toggle } = useWishlist();

  return (
    <div className="min-h-screen">
      <TopBar>
        <CartButton />
      </TopBar>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Your wishlist
        </h1>

        {isLoading && <p className="mt-6 text-muted">Loading…</p>}

        {!isLoading &&
          (items.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="text-sm text-muted">
                Nothing saved here yet — tap the heart on a product to add it.
              </p>
              <Link
                to="/"
                className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <WishlistCard
                  key={item.id}
                  product={item.product}
                  onRemove={() => toggle(item.product)}
                />
              ))}
            </div>
          ))}
      </main>
    </div>
  );
};

export default Wishlist;
