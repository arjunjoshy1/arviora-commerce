import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import EyeIcon from '../components/EyeIcon';
import Spinner from '../components/Spinner';
import { resetPassword } from '../api/auth';
import { useToast } from '../components/Toast';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const mismatch = confirm.length > 0 && confirm !== password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch || submitting) return;
    setSubmitting(true);
    try {
      await resetPassword(token, password);
      toast('Password updated. Please sign in.', 'success');
      navigate('/signin');
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not reset password',
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
            <p className="mt-1 text-sm text-muted">Choose a new password</p>
          </div>

          <div className="rounded-2xl bg-surface p-7 shadow-sm ring-1 ring-line">
            {!token ? (
              <p className="text-center text-sm text-muted">
                This reset link is invalid or incomplete. Please request a new
                one from{' '}
                <Link to="/forgot-password" className="text-ink underline">
                  Forgot password
                </Link>
                .
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={show ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-ink focus:bg-surface"
                      />
                      <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted transition hover:text-ink"
                      >
                        <EyeIcon open={show} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="confirm"
                      type={show ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full rounded-xl border bg-canvas px-4 py-2.5 text-sm outline-none transition focus:bg-surface ${
                        mismatch
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-line focus:border-ink'
                      }`}
                    />
                    {mismatch && (
                      <p className="mt-1.5 text-xs text-red-500">
                        Passwords don’t match.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || mismatch}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting && <Spinner />}
                  {submitting ? 'Updating…' : 'Update password'}
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
