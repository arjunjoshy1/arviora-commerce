import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchProducts } from '../../api';
import Sidebar from '../../components/Sidebar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

const Home = () => {
  // Storefront is focused on Clothing for now — default the grid to it.
  const [category, setCategory] = useState<string | undefined>('clothing');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const productsQuery = useQuery({
    queryKey: ['products', category, search],
    queryFn: () => fetchProducts({ category, search: search || undefined }),
  });

  const heroImages =
    productsQuery.data?.items.slice(0, 3).map((p) => p.imageUrl) ?? [];

  const scrollToProducts = () =>
    document
      .getElementById('shop')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categoriesQuery.data ?? []}
        onSelectCategory={setCategory}
      />
      <Navbar
        search={search}
        onSearchChange={setSearch}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <Hero images={heroImages} onShop={scrollToProducts} />
      <ProductGrid
        categories={categoriesQuery.data ?? []}
        activeCategory={category}
        onSelectCategory={setCategory}
        products={productsQuery.data}
        isLoading={productsQuery.isLoading}
        isError={productsQuery.isError}
      />
      <Footer />
    </div>
  );
};

export default Home;
