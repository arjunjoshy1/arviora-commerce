import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import EyeIcon from '../components/EyeIcon';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/useAuth';
import { useToast } from '../components/Toast';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Light client-side hint; the API enforces the real rules.
  const mismatch = confirm.length > 0 && confirm !== password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch || submitting) return;
    setSubmitting(true);
    try {
      const user = await register(name, email, password);
      toast(`Welcome to Arviora, ${user.name.split(' ')[0]}!`, 'success');
      navigate('/');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Sign up failed', 'error');
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
            <p className="mt-1 text-sm text-muted">Create your account</p>
          </div>

          <div className="rounded-2xl bg-surface p-7 shadow-sm ring-1 ring-line">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
                  />
                </div>

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

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
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
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted transition hover:text-ink"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
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
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting && <Spinner />}
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
