import { OrderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

/** Body for PATCH /api/orders/admin/:id/status (admin only). */
export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
