import { BadRequestException, Injectable } from '@nestjs/common';
import type { CartItem, Product } from '@prisma/client';
import type { CartLine } from '@arviora/shared';
import { PrismaService } from '../prisma/prisma.service';
import { CartLineDto } from './dto/cart.dto';

type CartItemWithProduct = CartItem & { product: Product };

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string): Promise<CartLine[]> {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });
    return items.map(toCartLine);
  }

  /**
   * Merge a guest cart (e.g. from localStorage) into the user's DB cart on
   * login — matching lines have their quantities summed, new lines are added.
   */
  async sync(userId: string, lines: CartLineDto[]): Promise<CartLine[]> {
    await this.prisma.$transaction(
      lines.map((line) =>
        this.prisma.cartItem.upsert({
          where: {
            userId_productId_size: {
              userId,
              productId: line.productId,
              size: line.size,
            },
          },
          create: {
            userId,
            productId: line.productId,
            size: line.size,
            quantity: line.quantity,
          },
          update: { quantity: { increment: line.quantity } },
        }),
      ),
    );
    return this.findAllForUser(userId);
  }

  /** Set the exact quantity for a line. A quantity of 0 or less removes it. */
  async upsert(
    userId: string,
    productId: string,
    size: string,
    quantity: number,
  ): Promise<void> {
    if (quantity <= 0) {
      await this.remove(userId, productId, size);
      return;
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException(`Product ${productId} not found`);
    }

    await this.prisma.cartItem.upsert({
      where: { userId_productId_size: { userId, productId, size } },
      create: { userId, productId, size, quantity },
      update: { quantity },
    });
  }

  async remove(userId: string, productId: string, size: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { userId, productId, size },
    });
  }

  async clear(userId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
  }
}

/** Map a Prisma cart row to the shared API shape. */
export function toCartLine(item: CartItemWithProduct): CartLine {
  return {
    productId: item.productId,
    slug: item.product.slug,
    name: item.product.name,
    imageUrl: item.product.imageUrl,
    priceInPaise: item.product.priceInPaise,
    currency: item.product.currency,
    color: item.product.color,
    size: item.size,
    quantity: item.quantity,
  };
}
