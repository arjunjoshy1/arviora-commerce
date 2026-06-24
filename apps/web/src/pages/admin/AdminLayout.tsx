import { Link, NavLink, Outlet } from 'react-router-dom';
import Logo from '../../components/Logo';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/support', label: 'Support' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Arviora home">
              <Logo />
            </Link>
            <span className="text-sm font-medium text-muted">Admin</span>
          </div>
          <Link
            to="/"
            className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            ← Back to store
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-8 flex gap-2 rounded-2xl bg-surface p-2 ring-1 ring-line">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-muted hover:bg-canvas hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
