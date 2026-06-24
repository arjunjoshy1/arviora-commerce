import { useState } from 'react';
import { useToast } from '../../../components/Toast';

interface MockCard {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'RuPay';
  last4: string;
  expiry: string;
}

const BRAND_FROM_DIGIT: Record<string, MockCard['brand']> = {
  '4': 'Visa',
  '5': 'Mastercard',
  '6': 'RuPay',
};

const initialCards: MockCard[] = [
  { id: 'demo-1', brand: 'Visa', last4: '4242', expiry: '08/27' },
];

/**
 * Demo-only UI — no real card data is collected or sent anywhere; there's no
 * payment gateway wired up yet, so this just shows what the section will look
 * like once one is integrated.
 */
const PaymentMethods = () => {
  const toast = useToast();
  const [cards, setCards] = useState<MockCard[]>(initialCards);
  const [adding, setAdding] = useState(false);
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = number.replace(/\s/g, '');
    if (digits.length < 12 || !expiry) {
      toast('Enter a valid card number and expiry', 'error');
      return;
    }
    const brand = BRAND_FROM_DIGIT[digits[0]] ?? 'Visa';
    setCards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), brand, last4: digits.slice(-4), expiry },
    ]);
    setNumber('');
    setExpiry('');
    setAdding(false);
    toast('Card added', 'success');
  };

  const handleRemove = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="rounded-2xl bg-surface p-6 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Payment methods</h2>
        <button
          onClick={() => setAdding((s) => !s)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {adding ? 'Cancel' : 'Add card'}
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">
        Demo only — no payment gateway is connected yet, so nothing here is
        charged or stored on a server.
      </p>

      {adding && (
        <form
          onSubmit={handleAdd}
          className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-line p-4"
        >
          <div className="col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Card number
            </label>
            <input
              required
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Expiry (MM/YY)
            </label>
            <input
              required
              placeholder="08/27"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Save card
            </button>
          </div>
        </form>
      )}

      <ul className="mt-4 space-y-3">
        {cards.map((card) => (
          <li
            key={card.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line p-4"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-14 place-items-center rounded-lg bg-ink text-[10px] font-semibold uppercase tracking-wide text-white">
                {card.brand}
              </span>
              <div>
                <p className="text-sm font-medium">•••• {card.last4}</p>
                <p className="text-xs text-muted">Expires {card.expiry}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(card.id)}
              className="text-sm font-medium text-muted transition hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
        {cards.length === 0 && (
          <p className="text-sm text-muted">No saved cards yet.</p>
        )}
      </ul>
    </div>
  );
};

export default PaymentMethods;
