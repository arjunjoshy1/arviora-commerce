import type { CreateTicketRequest, SupportTicket } from '@arviora/shared';
import { apiFetch } from '../lib/http';

export const createTicket = (
  body: CreateTicketRequest,
): Promise<SupportTicket> =>
  apiFetch<SupportTicket>('/support', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const fetchTickets = (): Promise<SupportTicket[]> =>
  apiFetch<SupportTicket[]>('/support');

export const fetchTicket = (id: string): Promise<SupportTicket> =>
  apiFetch<SupportTicket>(`/support/${id}`);
