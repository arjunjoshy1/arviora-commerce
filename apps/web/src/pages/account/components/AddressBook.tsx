import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Address } from '@arviora/shared';
import * as addressApi from '../../../api/addresses';
import type { AddressInput } from '../../../api/addresses';
import { useToast } from '../../../components/Toast';
import AddressForm from './AddressForm';

const ADDRESSES_KEY = ['addresses'];

const AddressBook = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: addresses, isLoading } = useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: addressApi.fetchAddresses,
  });

  const [editing, setEditing] = useState<Address | 'new' | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });

  const handleSave = async (input: AddressInput) => {
    try {
      if (editing === 'new' || !editing) {
        await addressApi.createAddress(input);
      } else {
        await addressApi.updateAddress(editing.id, input);
      }
      await refresh();
      toast('Address saved', 'success');
      setEditing(null);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not save address',
        'error',
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressApi.deleteAddress(id);
      await refresh();
      toast('Address removed', 'info');
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not remove address',
        'error',
      );
    }
  };

  return (
    <div className="rounded-2xl bg-surface p-6 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Addresses</h2>
        <button
          onClick={() => setEditing('new')}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add address
        </button>
      </div>

      {isLoading && <p className="mt-4 text-sm text-muted">Loading…</p>}

      {addresses && addresses.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          No saved addresses yet. Add one to speed up checkout.
        </p>
      )}

      {addresses && addresses.length > 0 && (
        <ul className="mt-4 space-y-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-line p-4"
            >
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  {address.label}
                  {address.isDefault && (
                    <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {address.name} · {address.phone}
                </p>
                <p className="text-sm text-muted">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}, {address.city},{' '}
                  {address.state} {address.postalCode}
                </p>
              </div>
              <div className="flex shrink-0 gap-3 text-sm font-medium">
                <button
                  onClick={() => setEditing(address)}
                  className="text-muted transition hover:text-ink"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-muted transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <AddressForm
          initial={editing === 'new' ? undefined : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default AddressBook;
