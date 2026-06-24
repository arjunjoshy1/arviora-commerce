import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as supportApi from '../../../api/support';
import { fetchOrders } from '../../../api/orders';
import { useToast } from '../../../components/Toast';
import TicketForm from './TicketForm';
import TicketStatusBadge from './TicketStatusBadge';

const TICKETS_KEY = ['support-tickets'];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

interface SupportSectionProps {
  presetOrderId?: string;
}

const SupportSection = ({ presetOrderId }: SupportSectionProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: tickets, isLoading } = useQuery({
    queryKey: TICKETS_KEY,
    queryFn: supportApi.fetchTickets,
  });
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const [showForm, setShowForm] = useState(false);

  // Arriving with a preset order (e.g. "Need help with this order?") should
  // open the form immediately instead of making the shopper click again.
  useEffect(() => {
    if (presetOrderId) setShowForm(true);
  }, [presetOrderId]);

  const handleSave = async (input: {
    orderId: string;
    subject: string;
    message: string;
  }) => {
    try {
      await supportApi.createTicket(input);
      await queryClient.invalidateQueries({ queryKey: TICKETS_KEY });
      toast('Ticket submitted', 'success');
      setShowForm(false);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not submit ticket',
        'error',
      );
    }
  };

  return (
    <div className="rounded-2xl bg-surface p-6 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Support</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Raise a ticket
        </button>
      </div>

      {isLoading && <p className="mt-4 text-sm text-muted">Loading…</p>}

      {tickets && tickets.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          No support tickets yet. Need help with an order? Raise a ticket and
          we'll take a look.
        </p>
      )}

      {tickets && tickets.length > 0 && (
        <ul className="mt-4 space-y-3">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="rounded-xl border border-line p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold">{ticket.subject}</p>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <p className="mt-1 text-sm text-muted">{ticket.message}</p>
              <p className="mt-2 text-xs text-muted">
                Order #{ticket.orderId.slice(-6).toUpperCase()} ·{' '}
                {formatDate(ticket.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <TicketForm
          orders={orders ?? []}
          presetOrderId={presetOrderId}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default SupportSection;
