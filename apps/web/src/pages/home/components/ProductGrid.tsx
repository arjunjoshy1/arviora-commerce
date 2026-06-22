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
  search: string;
  /** Fallback products to suggest when a search has no matches. */
  suggestions: Product[];
}

const Grid = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

const ProductGrid = ({
  categories,
  activeCategory,
  onSelectCategory,
  products,
  isLoading,
  isError,
  search,
  suggestions,
}: ProductGridProps) => {
  const searching = search.trim().length > 0;
  const noResults = !!products && products.items.length === 0;

  return (
    <section
      id="shop"
      className="mx-auto min-h-screen max-w-6xl scroll-mt-4 px-6 pb-20"
    >
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {searching ? (
              <>
                Results for “<span className="text-accent">{search}</span>”
              </>
            ) : (
              'Shop the collection'
            )}
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

      {products && !noResults && <Grid products={products.items} />}

      {/* No exact matches → suggest related items instead of a dead end. */}
      {noResults && (
        <div>
          <p className="text-muted">
            {searching
              ? `No exact matches for “${search}”.`
              : 'No products found.'}
          </p>
          {searching && suggestions.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 font-display text-lg font-semibold">
                You might also like
              </h3>
              <Grid products={suggestions.slice(0, 8)} />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
