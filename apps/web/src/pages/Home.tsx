import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatPrice } from '@arviora/shared';
import { fetchCategories, fetchProducts } from '../api';
import Logo from '../components/Logo';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/Toast';

export default function Home() {
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

  // A few product images for the hero collage.
  const heroImages =
    productsQuery.data?.items.slice(0, 3).map((p) => p.imageUrl) ?? [];

  function scrollToProducts() {
    document
      .getElementById('shop')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categoriesQuery.data ?? []}
        onSelectCategory={(slug) => setCategory(slug)}
      />
      <Navbar
        search={search}
        setSearch={setSearch}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-16 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">
              Curated for India
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Thoughtfully sourced.
              <br />
              Beautifully delivered.
            </h1>
            <p className="mt-4 max-w-md text-muted">
              A growing collection of beautiful products across every category —
              clothing, jewellery, decor, and the little things that make a
              house a home.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={scrollToProducts}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Shop the collection
              </button>
              <button
                onClick={scrollToProducts}
                className="rounded-full bg-surface px-6 py-3 text-sm font-medium ring-1 ring-line transition hover:ring-ink/30"
              >
                Browse categories
              </button>
            </div>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
              {heroImages[0] && (
                <img
                  src={heroImages[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="mt-8 grid gap-4">
              <div className="aspect-square overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
                {heroImages[1] && (
                  <img
                    src={heroImages[1]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="aspect-square overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
                {heroImages[2] && (
                  <img
                    src={heroImages[2]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop section */}
      <section id="shop" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Shop the collection
            </h2>
            <p className="mt-1 text-sm text-muted">
              {productsQuery.data
                ? `${productsQuery.data.total} products`
                : 'Loading…'}
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Pill active={!category} onClick={() => setCategory(undefined)}>
            All
          </Pill>
          {categoriesQuery.data?.map((c) => (
            <Pill
              key={c.id}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </Pill>
          ))}
        </div>

        {productsQuery.isLoading && <p className="text-muted">Loading…</p>}
        {productsQuery.isError && (
          <p className="text-red-600">
            Couldn’t load products. Is the API running on :3000?
          </p>
        )}

        {productsQuery.data &&
          (productsQuery.data.items.length === 0 ? (
            <p className="text-muted">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {productsQuery.data.items.map((p) => (
                <Link
                  to={`/product/${p.slug}`}
                  key={p.id}
                  className="group overflow-hidden rounded-2xl bg-surface ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden bg-canvas">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-wide text-muted">
                        {p.category.name}
                      </p>
                      {p.color && (
                        <span
                          className="h-3 w-3 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: p.color }}
                          title="Colour"
                        />
                      )}
                    </div>
                    <h3 className="mt-1 line-clamp-1 text-sm font-medium">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold">
                      {formatPrice(p.priceInPaise, p.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
      </section>

      <Footer />
    </div>
  );
}

function Navbar({
  search,
  setSearch,
  onOpenMenu,
}: {
  search: string;
  setSearch: (v: string) => void;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-surface"
        >
          <MenuIcon />
        </button>
        <Link to="/">
          <Logo />
        </Link>

        <div className="relative ml-auto hidden flex-1 sm:block sm:max-w-xs">
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-4 text-sm outline-none focus:border-ink"
          />
        </div>

        <AccountControl />
        <button
          aria-label="Cart"
          className="grid h-9 w-9 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:ring-ink/30"
        >
          <CartIcon />
        </button>
      </div>
    </header>
  );
}

/** Shows Sign in when logged out, or the user's name + a logout control. */
function AccountControl() {
  const { user, initializing, logout } = useAuth();
  const toast = useToast();

  async function handleLogout() {
    await logout();
    toast('Signed out', 'info');
  }

  if (initializing) {
    return (
      <div className="ml-auto h-9 w-20 animate-pulse rounded-full bg-surface sm:ml-0" />
    );
  }

  if (!user) {
    return (
      <Link
        to="/signin"
        className="ml-auto rounded-full px-4 py-2 text-sm font-medium hover:text-ink sm:ml-0"
      >
        Sign in
      </Link>
    );
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || 'U';
  return (
    <div className="ml-auto flex items-center gap-2 sm:ml-0">
      <span className="hidden items-center gap-2 sm:flex">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="text-sm font-medium">
          {user.name.split(' ')[0]}
          {user.role === 'ADMIN' && (
            <span className="ml-1.5 rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Admin
            </span>
          )}
        </span>
      </span>
      <button
        onClick={handleLogout}
        className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-ink"
      >
        Sign out
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <p>© {new Date().getFullYear()} Arviora. Thoughtfully sourced.</p>
      </div>
    </footer>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm transition ${
        active
          ? 'bg-accent text-white'
          : 'bg-surface text-ink/70 ring-1 ring-line hover:ring-ink/30'
      }`}
    >
      {children}
    </button>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CartIcon() {
  return (
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
      <circle cx="9" cy="20" r="1.3" />
      <circle cx="18" cy="20" r="1.3" />
      <path d="M2 3h2.2l2.1 12.4a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L21 7H5.3" />
    </svg>
  );
}
