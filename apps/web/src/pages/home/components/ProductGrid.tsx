import type { Category, Paginated, Product } from '@arviora/shared';
import CategoryPill from './CategoryPill';
import ProductCard from './ProductCard';

interface ProductGridProps {
  categories: Category[];
  activeCategory: string | undefined;
  onSelectCategory: (slug: string | undefined) => void;
  products: Paginated<Product> | undefined;
  isLoading: boolean;
  isError: boolean;
}

const ProductGrid = ({
  categories,
  activeCategory,
  onSelectCategory,
  products,
  isLoading,
  isError,
}: ProductGridProps) => (
  <section id="shop" className="mx-auto max-w-6xl px-6 pb-20">
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Shop the collection
        </h2>
        <p className="mt-1 text-sm text-muted">
          {products ? `${products.total} products` : 'Loading…'}
        </p>
      </div>
    </div>

    <div className="mb-8 flex flex-wrap gap-2">
      <CategoryPill
        active={!activeCategory}
        onClick={() => onSelectCategory(undefined)}
      >
        All
      </CategoryPill>
      {categories.map((c) => (
        <CategoryPill
          key={c.id}
          active={activeCategory === c.slug}
          onClick={() => onSelectCategory(c.slug)}
        >
          {c.name}
        </CategoryPill>
      ))}
    </div>

    {isLoading && <p className="text-muted">Loading…</p>}
    {isError && (
      <p className="text-red-600">
        Couldn’t load products. Is the API running on :3000?
      </p>
    )}

    {products &&
      (products.items.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ))}
  </section>
);

export default ProductGrid;
