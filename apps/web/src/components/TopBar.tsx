import { Link } from 'react-router-dom';
import Logo from './Logo';
import MenuIcon from './icons/MenuIcon';
import { useAppDispatch } from '../store/hooks';
import { openSidebar } from '../store/uiSlice';

interface TopBarProps {
  /** Right-aligned content (links, cart button, etc.). */
  children?: React.ReactNode;
}

/** Slim sticky header with the menu + brand on the left; used by inner pages. */
const TopBar = ({ children }: TopBarProps) => {
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
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
        </div>
        <div className="flex items-center gap-4">{children}</div>
      </div>
    </header>
  );
};

export default TopBar;
