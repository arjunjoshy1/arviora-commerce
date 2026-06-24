import { Injectable } from '@nestjs/common';
import type { AdminSummary } from '@arviora/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<AdminSummary> {
    const [totalProducts, totalOrders, revenue, openTickets, totalUsers] =
      await Promise.all([
        this.prisma.product.count(),
        this.prisma.order.count(),
        this.prisma.order.aggregate({
          where: { status: { not: 'CANCELLED' } },
          _sum: { subtotalInPaise: true },
        }),
        this.prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        this.prisma.user.count(),
      ]);

    return {
      totalProducts,
      totalOrders,
      totalRevenueInPaise: revenue._sum.subtotalInPaise ?? 0,
      openTickets,
      totalUsers,
    };
  }
}
