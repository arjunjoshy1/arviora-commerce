import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import { forgotPassword } from '../api/auth';
import { useToast } from '../components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Something went wrong',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo size="lg" showWordmark={false} />
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              Arviora
            </h1>
            <p className="mt-1 text-sm text-muted">
              {submitted ? 'Check your inbox' : 'Reset your password'}
            </p>
          </div>

          <div className="rounded-2xl bg-surface p-7 shadow-sm ring-1 ring-line">
            {submitted ? (
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-canvas">
                  <MailIcon />
                </div>
                <p className="text-sm text-ink">
                  If an account exists for{' '}
                  <span className="font-medium">{email}</span>, we’ve sent a
                  link to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <p className="text-sm text-muted">
                    Enter the email linked to your account and we’ll send you a
                    link to reset your password.
                  </p>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting && <Spinner />}
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            <Link
              to="/signin"
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
