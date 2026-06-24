import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useToast } from '../../components/Toast';
import TopBar from '../../components/TopBar';
import CartButton from '../../components/CartButton';
import ProfileSection from './components/ProfileSection';
import AddressBook from './components/AddressBook';
import PaymentMethods from './components/PaymentMethods';
import SecuritySection from './components/SecuritySection';
import SupportSection from './components/SupportSection';

type Tab = 'profile' | 'addresses' | 'payment' | 'security' | 'support';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'payment', label: 'Payment methods' },
  { id: 'security', label: 'Password' },
  { id: 'support', label: 'Support' },
];

const Account = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as Tab | null;
  const orderIdFromUrl = searchParams.get('orderId') ?? undefined;
  const [tab, setTab] = useState<Tab>(tabFromUrl ?? 'profile');

  if (!user) return null;

  const initial = user.name.trim().charAt(0).toUpperCase() || 'U';

  const handleLogout = async () => {
    await logout();
    toast('Signed out', 'info');
  };

  return (
    <div className="min-h-screen">
      <TopBar>
        <CartButton />
      </TopBar>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          My account
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="space-y-6">
            <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-base font-semibold text-white">
                {initial}
              </span>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1 rounded-2xl bg-surface p-2 ring-1 ring-line">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                    tab === t.id
                      ? 'bg-accent text-white'
                      : 'text-muted hover:bg-canvas hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <nav className="space-y-1 rounded-2xl bg-surface p-2 ring-1 ring-line">
              <Link
                to="/orders"
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-canvas hover:text-ink"
              >
                My orders
              </Link>
              <Link
                to="/wishlist"
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-canvas hover:text-ink"
              >
                Wishlist
              </Link>
            </nav>

            <button
              onClick={handleLogout}
              className="w-full rounded-full bg-surface px-5 py-2.5 text-sm font-medium text-muted ring-1 ring-line transition hover:text-ink"
            >
              Sign out
            </button>
          </aside>

          <div>
            {tab === 'profile' && <ProfileSection />}
            {tab === 'addresses' && <AddressBook />}
            {tab === 'payment' && <PaymentMethods />}
            {tab === 'security' && <SecuritySection />}
            {tab === 'support' && (
              <SupportSection presetOrderId={orderIdFromUrl} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
