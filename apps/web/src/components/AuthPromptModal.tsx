import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import EyeIcon from './EyeIcon';
import Spinner from './Spinner';
import CloseIcon from './icons/CloseIcon';
import { useAuth } from '../auth/useAuth';
import { useToast } from './Toast';

interface AuthPromptModalProps {
  open: boolean;
  message?: string;
  onClose: () => void;
  onSignedIn: () => void;
}

/** A lightweight sign-in popup, used to gate guest-only actions in place. */
const AuthPromptModal = ({
  open,
  message,
  onClose,
  onSignedIn,
}: AuthPromptModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      setEmail('');
      setPassword('');
      onSignedIn();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Sign in failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-canvas p-7 shadow-xl ring-1 ring-line">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex flex-col items-center text-center">
            <Logo size="md" showWordmark={false} />
            <p className="mt-2 text-sm text-muted">
              {message ?? 'Sign in to continue'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="modal-email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="modal-email"
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
                htmlFor="modal-password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="modal-password"
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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

        <p className="mt-5 text-center text-sm text-muted">
          New to Arviora?{' '}
          <Link
            to="/signup"
            onClick={onClose}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPromptModal;
