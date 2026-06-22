import { Injectable, NotFoundException } from '@nestjs/common';
import type { Product, Category, WishlistItem } from '@prisma/client';
import type { WishlistItem as ApiWishlistItem } from '@arviora/shared';
import { PrismaService } from '../prisma/prisma.service';

type WishlistItemWithProduct = WishlistItem & {
  product: Product & { category: Category };
};

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string): Promise<ApiWishlistItem[]> {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(toApiWishlistItem);
  }

  async add(userId: string, productId: string): Promise<ApiWishlistItem> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const item = await this.prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
      include: { product: { include: { category: true } } },
    });
    return toApiWishlistItem(item);
  }

  async remove(userId: string, productId: string): Promise<void> {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
  }
}

/** Map a Prisma wishlist row to the shared API shape. */
export function toApiWishlistItem(
  item: WishlistItemWithProduct,
): ApiWishlistItem {
  const { product } = item;
  return {
    id: item.id,
    createdAt: item.createdAt.toISOString(),
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      priceInPaise: product.priceInPaise,
      currency: product.currency,
      imageUrl: product.imageUrl,
      color: product.color,
      stock: product.stock,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    },
  };
}
