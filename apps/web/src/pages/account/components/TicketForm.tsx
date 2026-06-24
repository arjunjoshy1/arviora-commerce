import { useState } from 'react';
import type { Order } from '@arviora/shared';
import CloseIcon from '../../../components/icons/CloseIcon';
import Spinner from '../../../components/Spinner';

interface TicketFormProps {
  orders: Order[];
  presetOrderId?: string;
  onSave: (input: {
    orderId: string;
    subject: string;
    message: string;
  }) => Promise<void>;
  onClose: () => void;
}

const TicketForm = ({
  orders,
  presetOrderId,
  onSave,
  onClose,
}: TicketFormProps) => {
  const [orderId, setOrderId] = useState(presetOrderId ?? orders[0]?.id ?? '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !orderId) return;
    setSubmitting(true);
    try {
      await onSave({ orderId, subject, message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-y-auto rounded-2xl bg-canvas p-7 shadow-xl ring-1 ring-line">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Raise a ticket</h2>
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
            <label className="mb-1.5 block text-sm font-medium">Order</label>
            <select
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            >
              {orders.length === 0 && <option value="">No orders yet</option>}
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order #{order.id.slice(-6).toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Subject</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's going on…"
              className="w-full resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !orderId}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting && <Spinner />}
            {submitting ? 'Submitting…' : 'Submit ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
