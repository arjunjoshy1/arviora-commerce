import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupportTicket } from '@prisma/client';
import type { SupportTicket as ApiSupportTicket } from '@arviora/shared';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

type TicketWithUser = SupportTicket & { user: { name: string; email: string } };

export function toApiTicket(
  ticket: SupportTicket | TicketWithUser,
): ApiSupportTicket {
  return {
    id: ticket.id,
    orderId: ticket.orderId,
    subject: ticket.subject,
    message: ticket.message,
    status: ticket.status,
    createdAt: ticket.createdAt.toISOString(),
    ...('user' in ticket
      ? { userName: ticket.user.name, userEmail: ticket.user.email }
      : {}),
  };
}

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTicketDto): Promise<SupportTicket> {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();

    return this.prisma.supportTicket.create({
      data: {
        userId,
        orderId: dto.orderId,
        subject: dto.subject,
        message: dto.message,
      },
    });
  }

  async findAllForUser(userId: string): Promise<SupportTicket[]> {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<SupportTicket> {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.userId !== userId) throw new ForbiddenException();
    return ticket;
  }

  /** Admin: every ticket across all users, newest first. */
  findAllAdmin(): Promise<TicketWithUser[]> {
    return this.prisma.supportTicket.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Admin: move a ticket to a new status. */
  async updateStatus(
    id: string,
    dto: UpdateTicketStatusDto,
  ): Promise<TicketWithUser> {
    const existing = await this.prisma.supportTicket.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Ticket not found');

    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: dto.status },
      include: { user: { select: { name: true, email: true } } },
    });
  }
}
