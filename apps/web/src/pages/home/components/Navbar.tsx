import { Link } from 'react-router-dom';
import Logo from '../../../components/Logo';
import CartButton from '../../../components/CartButton';
import MenuIcon from '../../../components/icons/MenuIcon';
import AccountControl from './AccountControl';
import SearchIcon from './icons/SearchIcon';
import ClearIcon from './icons/ClearIcon';
import { useAppDispatch } from '../../../store/hooks';
import { openSidebar } from '../../../store/uiSlice';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const Navbar = ({ search, onSearchChange, onSearchSubmit }: NavbarProps) => {
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
        <button
          onClick={() => dispatch(openSidebar())}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-surface"
        >
          <MenuIcon />
        </button>
        <Link to="/">
          <Logo />
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="relative ml-auto hidden flex-1 sm:block sm:max-w-xs"
        >
          <SearchIcon />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-9 text-sm outline-none focus:border-ink"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-canvas hover:text-ink"
            >
              <ClearIcon />
            </button>
          )}
        </form>

        <AccountControl />
        <CartButton />
      </div>
    </header>
  );
};

export default Navbar;
