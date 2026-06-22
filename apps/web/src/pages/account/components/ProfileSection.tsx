import { useState } from 'react';
import { useAuth } from '../../../auth/useAuth';
import { useToast } from '../../../components/Toast';
import Spinner from '../../../components/Spinner';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const ProfileSection = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const dirty = name.trim() !== user.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !dirty) return;
    setSubmitting(true);
    try {
      await updateProfile(name.trim());
      toast('Profile updated', 'success');
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not update profile',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-surface p-6 ring-1 ring-line">
      <h2 className="font-display text-lg font-semibold">Profile</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-muted outline-none"
          />
        </div>

        <p className="text-xs text-muted">
          Member since {formatDate(user.createdAt)}
        </p>

        <button
          type="submit"
          disabled={!dirty || submitting}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting && <Spinner />}
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSection;
