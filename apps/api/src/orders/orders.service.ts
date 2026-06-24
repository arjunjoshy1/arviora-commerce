import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderItem, Prisma, Role, User } from '@prisma/client';
import type { Order as ApiOrder } from '@arviora/shared';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type OrderWithItems = Order & { items: OrderItem[] };
type OrderWithItemsAndUser = OrderWithItems & {
  user: { name: string; email: string };
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Place an order from the given cart lines. Runs in a transaction so stock
   * checks, stock decrements, and order creation all succeed or all roll back.
   * Prices are always taken from the database — never trusted from the client.
   */
  async placeOrder(userId: string, dto: PlaceOrderDto): Promise<ApiOrder> {
    const order = await this.prisma.$transaction(async (tx) => {
      let subtotalInPaise = 0;
      let currency = 'INR';
      const itemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const line of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: line.productId },
        });
        if (!product) {
          throw new BadRequestException(
            `Product ${line.productId} no longer exists`,
          );
        }
        if (product.stock < line.quantity) {
          throw new BadRequestException(
            `Not enough stock for "${product.name}" (${product.stock} left)`,
          );
        }

        subtotalInPaise += product.priceInPaise * line.quantity;
        currency = product.currency;

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: line.quantity } },
        });

        itemsData.push({
          product: { connect: { id: product.id } },
          name: product.name,
          priceInPaise: product.priceInPaise,
          size: line.size,
          quantity: line.quantity,
        });
      }

      return tx.order.create({
        data: {
          userId,
          subtotalInPaise,
          currency,
          shippingName: dto.shipping.name,
          shippingPhone: dto.shipping.phone,
          shippingLine1: dto.shipping.line1,
          shippingLine2: dto.shipping.line2,
          shippingCity: dto.shipping.city,
          shippingState: dto.shipping.state,
          shippingPostalCode: dto.shipping.postalCode,
          items: { create: itemsData },
        },
        include: { items: true },
      });
    });

    return toApiOrder(order);
  }

  async findAllForUser(userId: string): Promise<ApiOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(toApiOrder);
  }

  async findOne(id: string, user: User): Promise<ApiOrder> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    // Owners can view their own orders; admins can view any.
    if (order.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    return toApiOrder(order);
  }

  /** Admin: every order across all users, newest first. */
  async findAllAdmin(): Promise<ApiOrder[]> {
    const orders = await this.prisma.order.findMany({
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(toApiOrder);
  }

  /** Admin: move an order to a new status. */
  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<ApiOrder> {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Order not found');

    const order = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
    return toApiOrder(order);
  }
}

/** Map a Prisma order row to the shared API shape. */
export function toApiOrder(
  order: OrderWithItems | OrderWithItemsAndUser,
): ApiOrder {
  return {
    id: order.id,
    status: order.status,
    subtotalInPaise: order.subtotalInPaise,
    currency: order.currency,
    shipping: {
      name: order.shippingName,
      phone: order.shippingPhone,
      line1: order.shippingLine1,
      line2: order.shippingLine2 ?? undefined,
      city: order.shippingCity,
      state: order.shippingState,
      postalCode: order.shippingPostalCode,
    },
    items: order.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      priceInPaise: i.priceInPaise,
      size: i.size,
      quantity: i.quantity,
    })),
    createdAt: order.createdAt.toISOString(),
    ...('user' in order
      ? { userName: order.user.name, userEmail: order.user.email }
      : {}),
  };
}
