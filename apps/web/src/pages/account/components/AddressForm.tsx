import { useState } from 'react';
import type { Address } from '@arviora/shared';
import type { AddressInput } from '../../../api/addresses';
import CloseIcon from '../../../components/icons/CloseIcon';
import Spinner from '../../../components/Spinner';

interface AddressFormProps {
  initial?: Address;
  onSave: (input: AddressInput) => Promise<void>;
  onClose: () => void;
}

const EMPTY: AddressInput = {
  label: '',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  isDefault: false,
};

const AddressForm = ({ initial, onSave, onClose }: AddressFormProps) => {
  const [values, setValues] = useState<AddressInput>(
    initial
      ? {
          label: initial.label,
          name: initial.name,
          phone: initial.phone,
          line1: initial.line1,
          line2: initial.line2 ?? '',
          city: initial.city,
          state: initial.state,
          postalCode: initial.postalCode,
          isDefault: initial.isDefault,
        }
      : EMPTY,
  );
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof AddressInput, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSave({ ...values, line2: values.line2 || null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-y-auto rounded-2xl bg-canvas p-7 shadow-xl ring-1 ring-line">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {initial ? 'Edit address' : 'Add address'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Label</label>
            <input
              required
              value={values.label}
              onChange={(e) => setField('label', e.target.value)}
              placeholder="Home, Work…"
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                Full name
              </label>
              <input
                required
                value={values.name}
                onChange={(e) => setField('name', e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Phone</label>
              <input
                required
                value={values.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                Address line 1
              </label>
              <input
                required
                value={values.line1}
                onChange={(e) => setField('line1', e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                Address line 2 (optional)
              </label>
              <input
                value={values.line2 ?? ''}
                onChange={(e) => setField('line2', e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">City</label>
              <input
                required
                value={values.city}
                onChange={(e) => setField('city', e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">State</label>
              <input
                required
                value={values.state}
                onChange={(e) => setField('state', e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium">
                PIN code
              </label>
              <input
                required
                value={values.postalCode}
                onChange={(e) => setField('postalCode', e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.isDefault ?? false}
              onChange={(e) =>
                setValues((v) => ({ ...v, isDefault: e.target.checked }))
              }
              className="h-4 w-4 rounded border-line"
            />
            Set as default address
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting && <Spinner />}
            {submitting ? 'Saving…' : 'Save address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
