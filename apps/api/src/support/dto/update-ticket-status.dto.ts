import { SupportTicketStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

/** Body for PATCH /api/support/admin/:id/status (admin only). */
export class UpdateTicketStatusDto {
  @IsEnum(SupportTicketStatus)
  status!: SupportTicketStatus;
}
