/**
 * Arviora logo — a rounded charcoal mark with an "A" monogram, next to the
 * wordmark in the display serif. Reused in the header and auth pages.
 */
export default function Logo({
  size = 'md',
  showWordmark = true,
}: {
  size?: 'md' | 'lg';
  showWordmark?: boolean;
}) {
  const mark = size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  const text = size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`grid ${mark} place-items-center rounded-xl bg-accent text-white`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 28 28"
          className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'}
          fill="none"
        >
          {/* AV monogram — stacked chevrons (A over V) */}
          <path
            d="M6 12 14 5l8 7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 16l8 7 8-7"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className={`font-display font-semibold tracking-tight ${text}`}>
          Arviora
        </span>
      )}
    </span>
  );
}
