/** Eye / eye-off icon used to toggle password visibility. */
export default function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7c2 0 3.8.66 5.3 1.6M22 12s-3.5 7-10 7c-2 0-3.8-.66-5.3-1.6" />
          <path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" />
          <path d="M3 3l18 18" />
        </>
      )}
    </svg>
  );
}
