import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchProducts } from '../../api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

const Home = () => {
  const [searchParams] = useSearchParams();
  // Category can arrive via the URL (?category=…), e.g. from the global nav
  // drawer on another page. `all` means no filter; absent defaults to clothing.
  const categoryParam = searchParams.get('category');
  const categoryFromUrl =
    categoryParam === 'all' ? undefined : (categoryParam ?? 'clothing');

  // Storefront is focused on Clothing for now — default the grid to it.
  const [category, setCategory] = useState<string | undefined>(categoryFromUrl);
  const [search, setSearch] = useState('');

  // Keep the grid in sync when the URL category param changes (cross-page nav).
  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const productsQuery = useQuery({
    queryKey: ['products', category, search],
    queryFn: () => fetchProducts({ category, search: search || undefined }),
  });

  // Category products without the search term — shown as "you might also like"
  // when a search returns nothing. Only fetched while a search is active.
  const suggestionsQuery = useQuery({
    queryKey: ['suggestions', category],
    queryFn: () => fetchProducts({ category }),
    enabled: search.trim().length > 0,
  });

  // Hero collage uses its own query so it stays put while you search/filter.
  const heroQuery = useQuery({
    queryKey: ['hero-products'],
    queryFn: () => fetchProducts({ category: 'clothing' }),
  });
  const heroImages =
    heroQuery.data?.items.slice(0, 3).map((p) => p.imageUrl) ?? [];

  const searchActive = search.trim().length > 0;

  const scrollToProducts = () =>
    document
      .getElementById('shop')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Bring the shopper down to the results the moment they start searching. The
  // results section has a min-height so the hero always scrolls fully out.
  const prevSearch = useRef('');
  useEffect(() => {
    const hadSearch = prevSearch.current.trim().length > 0;
    prevSearch.current = search;
    if (searchActive && !hadSearch) {
      document
        .getElementById('shop')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [search, searchActive]);

  // A category arriving via the URL (a pick from the global nav drawer, on this
  // page or another) should land the shopper on the product grid. Defer a frame
  // so the grid is laid out before we scroll — matters on cross-page nav.
  useEffect(() => {
    if (!categoryParam) return;
    const id = requestAnimationFrame(() =>
      document
        .getElementById('shop')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
    return () => cancelAnimationFrame(id);
  }, [categoryParam]);

  return (
    <div className="min-h-screen">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={scrollToProducts}
      />
      <Hero images={heroImages} onShop={scrollToProducts} />
      <ProductGrid
        categories={categoriesQuery.data ?? []}
        activeCategory={category}
        onSelectCategory={setCategory}
        products={productsQuery.data}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
        search={search}
        suggestions={suggestionsQuery.data?.items ?? []}
      />
      <Footer />
    </div>
  );
};

export default Home;
