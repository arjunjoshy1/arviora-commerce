import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import EyeIcon from '../components/EyeIcon';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/useAuth';
import { useToast } from '../components/Toast';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      navigate('/');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Sign in failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Centered card */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo size="lg" showWordmark={false} />
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              Arviora
            </h1>
            <p className="mt-1 text-sm text-muted">Sign in to continue</p>
          </div>

          <div className="rounded-2xl bg-surface p-7 shadow-sm ring-1 ring-line">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting && <Spinner />}
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            New to Arviora?{' '}
            <Link
              to="/signup"
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
