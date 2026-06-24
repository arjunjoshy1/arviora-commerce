import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupportTicketStatus } from '@arviora/shared';
import { fetchAdminTickets, updateTicketStatus } from '../../api/admin';
import { useToast } from '../../components/Toast';

const STATUSES: SupportTicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

const TICKETS_KEY = ['admin-tickets'];

export default function AdminSupport() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    data: tickets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: TICKETS_KEY,
    queryFn: fetchAdminTickets,
  });

  const handleStatusChange = async (
    id: string,
    status: SupportTicketStatus,
  ) => {
    try {
      await updateTicketStatus(id, status);
      queryClient.invalidateQueries({ queryKey: TICKETS_KEY });
      toast('Ticket status updated', 'success');
    } catch {
      toast('Couldn’t update ticket status', 'error');
    }
  };

  if (isLoading) return <p className="text-muted">Loading…</p>;
  if (isError || !tickets) {
    return <p className="text-red-600">Couldn’t load tickets.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-5 py-3">Subject</th>
            <th className="px-5 py-3">Customer</th>
            <th className="px-5 py-3">Order</th>
            <th className="px-5 py-3">Raised</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tickets.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-muted">
                No support tickets yet.
              </td>
            </tr>
          )}
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="px-5 py-3">
                <p className="font-medium">{ticket.subject}</p>
                <p className="max-w-xs truncate text-xs text-muted">
                  {ticket.message}
                </p>
              </td>
              <td className="px-5 py-3 text-muted">
                {ticket.userName ?? '—'}
                {ticket.userEmail && (
                  <span className="block text-xs">{ticket.userEmail}</span>
                )}
              </td>
              <td className="px-5 py-3 text-muted">
                #{ticket.orderId.slice(-6).toUpperCase()}
              </td>
              <td className="px-5 py-3 text-muted">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-3">
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    handleStatusChange(
                      ticket.id,
                      e.target.value as SupportTicketStatus,
                    )
                  }
                  className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium outline-none transition focus:border-ink"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
