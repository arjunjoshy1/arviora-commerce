interface CategoryPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const CategoryPill = ({ active, onClick, children }: CategoryPillProps) => (
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

export default CategoryPill;
