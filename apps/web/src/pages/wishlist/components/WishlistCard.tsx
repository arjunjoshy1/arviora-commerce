import { Link } from 'react-router-dom';
import { formatPrice, type Product } from '@arviora/shared';
import HeartIcon from '../../../components/icons/HeartIcon';

interface WishlistCardProps {
  product: Product;
  onRemove: () => void;
}

const WishlistCard = ({ product, onRemove }: WishlistCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl bg-surface ring-1 ring-line transition hover:shadow-md">
    <button
      onClick={onRemove}
      aria-label="Remove from wishlist"
      className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-canvas/90 text-accent backdrop-blur transition hover:opacity-80"
    >
      <HeartIcon filled />
    </button>
    <Link to={`/product/${product.slug}`}>
      <div className="aspect-square overflow-hidden bg-canvas">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-muted">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-1 text-sm font-medium">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-semibold">
          {formatPrice(product.priceInPaise, product.currency)}
        </p>
      </div>
    </Link>
  </div>
);

export default WishlistCard;
