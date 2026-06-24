import { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import CartButton from '../components/CartButton';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';

interface ContactFields {
  name: string;
  email: string;
  message: string;
}

const EMPTY: ContactFields = { name: '', email: '', message: '' };

const Contact = () => {
  const toast = useToast();
  const [values, setValues] = useState<ContactFields>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof ContactFields, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // No backend endpoint yet — acknowledge locally so the form still feels real.
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast("Message sent — we'll get back to you soon.", 'success');
    setValues(EMPTY);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <TopBar>
        <Link
          to="/"
          className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
        >
          ← Back to shop
        </Link>
        <CartButton />
      </TopBar>

      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">
          Get in touch
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          We'd love to hear from you.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Questions about an order, a product, or just want to say hello — drop
          us a line and we'll reply as soon as we can.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <input
                required
                value={values.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                required
                type="email"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={values.message}
                onChange={(e) => setField('message', e.target.value)}
                placeholder="How can we help?"
                className="w-full resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {submitting && <Spinner />}
              {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>

          <aside className="space-y-6 rounded-2xl bg-surface p-6 ring-1 ring-line">
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p className="mt-1 text-sm text-muted">hello@arviora.in</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Support hours</p>
              <p className="mt-1 text-sm text-muted">Mon–Sat, 10am–7pm IST</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Based in</p>
              <p className="mt-1 text-sm text-muted">Bengaluru, India</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
          <Logo />
          <p>© {new Date().getFullYear()} Arviora. Thoughtfully sourced.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
