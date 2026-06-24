import type { SupportTicketStatus } from '@arviora/shared';

interface TicketStatusBadgeProps {
  status: SupportTicketStatus;
}

const STYLES: Record<SupportTicketStatus, string> = {
  OPEN: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
};

const LABELS: Record<SupportTicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
};

const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STYLES[status]}`}
  >
    {LABELS[status]}
  </span>
);

export default TicketStatusBadge;
