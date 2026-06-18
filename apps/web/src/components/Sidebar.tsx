import { Link } from 'react-router-dom';
import type { Category } from '@arviora/shared';
import Logo from './Logo';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './Toast';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectCategory: (slug?: string) => void;
};

/**
 * Slide-out navigation drawer with account, shop, and info links.
 * Opens from the left with a dimmed overlay behind it.
 */
export default function Sidebar({
  open,
  onClose,
  categories,
  onSelectCategory,
}: SidebarProps) {
  const { user, isAdmin, logout } = useAuth();
  const toast = useToast();

  async function handleLogout() {
    await logout();
    onClose();
    toast('Signed out', 'info');
  }

  return (
    <>
      {/* Dimmed overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      />

      {/* Panel */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-80 max-w-[85vw] flex-col bg-surface shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-label="Menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-canvas hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Account */}
          <Section title="Account">
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold text-white">
                    {user.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {user.email}
                    </span>
                  </span>
                </div>
                <Item to="/account" icon={<SettingsIcon />} onClick={onClose}>
                  My account
                </Item>
                <Item to="/orders" icon={<BoxIcon />} onClick={onClose}>
                  My orders
                </Item>
                <Item to="/wishlist" icon={<HeartIcon />} onClick={onClose}>
                  Wishlist
                </Item>
                {isAdmin && (
                  <Item to="/admin" icon={<GridIcon />} onClick={onClose}>
                    Admin dashboard
                  </Item>
                )}
                <ButtonItem onClick={handleLogout} icon={<LogoutIcon />}>
                  Sign out
                </ButtonItem>
              </>
            ) : (
              <>
                <Item to="/signin" icon={<UserIcon />} onClick={onClose}>
                  Sign in
                </Item>
                <Item to="/signup" icon={<SettingsIcon />} onClick={onClose}>
                  Create account
                </Item>
              </>
            )}
          </Section>

          {/* Shop by category */}
          <Section title="Shop">
            <ButtonItem
              onClick={() => {
                onSelectCategory(undefined);
                onClose();
              }}
              icon={<GridIcon />}
            >
              All products
            </ButtonItem>
            {categories.map((c) => (
              <ButtonItem
                key={c.id}
                onClick={() => {
                  onSelectCategory(c.slug);
                  onClose();
                }}
                icon={<TagIcon />}
              >
                {c.name}
              </ButtonItem>
            ))}
          </Section>

          {/* Info */}
          <Section title="Information">
            <Item to="/about" icon={<InfoIcon />} onClick={onClose}>
              About us
            </Item>
            <Item to="/contact" icon={<MailIcon />} onClick={onClose}>
              Contact
            </Item>
            <Item to="/help" icon={<HelpIcon />} onClick={onClose}>
              Help &amp; FAQ
            </Item>
          </Section>
        </nav>

        <div className="border-t border-line px-5 py-4 text-xs text-muted">
          © {new Date().getFullYear()} Arviora
        </div>
      </aside>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Item({
  to,
  icon,
  onClick,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-canvas"
    >
      <span className="text-muted">{icon}</span>
      {children}
    </Link>
  );
}

function ButtonItem({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-canvas"
    >
      <span className="text-muted">{icon}</span>
      {children}
    </button>
  );
}

/* ---- icons (inherit currentColor) ---- */
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const CloseIcon = () => (
  <svg {...base}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const UserIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
const SettingsIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
);
const BoxIcon = () => (
  <svg {...base}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </svg>
);
const HeartIcon = () => (
  <svg {...base}>
    <path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z" />
  </svg>
);
const GridIcon = () => (
  <svg {...base}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const TagIcon = () => (
  <svg {...base}>
    <path d="M3 7v5l9 9 7-7-9-9H5a2 2 0 0 0-2 2Z" />
    <circle cx="7.5" cy="7.5" r="1" />
  </svg>
);
const InfoIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);
const MailIcon = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const HelpIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 0 1 4 2c0 1.5-2 2-2 3M12 17h.01" />
  </svg>
);
const LogoutIcon = () => (
  <svg {...base}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);
