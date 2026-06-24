const ChevronArrowIcon = ({
  direction = 'left',
}: {
  direction?: 'left' | 'right';
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={direction === 'right' ? 'rotate-180' : ''}
  >
    <path d="M12.5 5L7 10l5.5 5" />
  </svg>
);

export default ChevronArrowIcon;
