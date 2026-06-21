import { Link } from 'react-router-dom';
import Logo from '../../../components/Logo';
import AccountControl from './AccountControl';
import CartButton from '../../../components/CartButton';
import MenuIcon from './icons/MenuIcon';
import SearchIcon from './icons/SearchIcon';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenMenu: () => void;
}

const Navbar = ({ search, onSearchChange, onOpenMenu }: NavbarProps) => (
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
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-4 text-sm outline-none focus:border-ink"
        />
      </div>

      <AccountControl />
      <CartButton />
    </div>
  </header>
);

export default Navbar;
