import type { Address } from '@arviora/shared';

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: string | 'new';
  onSelect: (id: string | 'new') => void;
}

const AddressSelector = ({
  addresses,
  selectedId,
  onSelect,
}: AddressSelectorProps) => (
  <div className="grid gap-3">
    {addresses.map((address) => (
      <label
        key={address.id}
        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
          selectedId === address.id
            ? 'border-ink bg-surface'
            : 'border-line hover:bg-surface/60'
        }`}
      >
        <input
          type="radio"
          name="shipping-address"
          checked={selectedId === address.id}
          onChange={() => onSelect(address.id)}
          className="mt-1 h-4 w-4 shrink-0 accent-ink"
        />
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
      </label>
    ))}

    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
        selectedId === 'new'
          ? 'border-ink bg-surface'
          : 'border-line hover:bg-surface/60'
      }`}
    >
      <input
        type="radio"
        name="shipping-address"
        checked={selectedId === 'new'}
        onChange={() => onSelect('new')}
        className="h-4 w-4 shrink-0 accent-ink"
      />
      <span className="text-sm font-semibold">Use a new address</span>
    </label>
  </div>
);

export default AddressSelector;
