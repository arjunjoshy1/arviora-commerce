import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api';
import Sidebar from './Sidebar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeSidebar, selectSidebarOpen } from '../store/uiSlice';

/**
 * App-wide nav drawer. Rendered once at the root and driven by the Redux
 * `ui.sidebarOpen` flag (same pattern as the cart drawer), so any page can
 * open it via `openSidebar()`. Categories come from the shared TanStack Query
 * cache, and picking one routes to Home with a `?category=` param.
 */
const AppSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector(selectSidebarOpen);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Route to Home with a `?category=` param; Home reads it and filters the grid.
  // Works whether we're already on Home or on any other page.
  const handleSelectCategory = (slug?: string) => {
    navigate(slug ? `/?category=${slug}` : '/?category=all');
  };

  return (
    <Sidebar
      open={open}
      onClose={() => dispatch(closeSidebar())}
      categories={categories ?? []}
      onSelectCategory={handleSelectCategory}
    />
  );
};

export default AppSidebar;
