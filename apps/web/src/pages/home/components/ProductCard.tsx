import { Link } from 'react-router-dom';
import { formatPrice, type Product } from '@arviora/shared';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => (
  <Link
    to={`/product/${product.slug}`}
    className="group overflow-hidden rounded-2xl bg-surface ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
  >
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
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wide text-muted">
          {product.category.name}
        </p>
        {product.color && (
          <span
            className="h-3 w-3 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: product.color }}
            title="Colour"
          />
        )}
      </div>
      <h3 className="mt-1 line-clamp-1 text-sm font-medium">{product.name}</h3>
      <p className="mt-2 text-sm font-semibold">
        {formatPrice(product.priceInPaise, product.currency)}
      </p>
    </div>
  </Link>
);

export default ProductCard;
