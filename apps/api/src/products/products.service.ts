import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FindProductsDto } from './dto/find-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { slugify } from '../common/strings';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindProductsDto) {
    const { category, search, page, pageSize } = query;

    const where: Prisma.ProductWhereInput = {
      ...(category ? { category: { slug: category } } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return product;
  }

  listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  /** Admin: create a product under an existing category. */
  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { slug: dto.categorySlug },
    });
    if (!category) {
      throw new BadRequestException(
        `Category "${dto.categorySlug}" does not exist`,
      );
    }

    const slug = slugify(dto.name);
    if (await this.prisma.product.findUnique({ where: { slug } })) {
      throw new BadRequestException(
        `A product named "${dto.name}" already exists`,
      );
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        priceInPaise: dto.priceInPaise,
        currency: dto.currency,
        imageUrl: dto.imageUrl,
        color: dto.color,
        stock: dto.stock,
        categoryId: category.id,
      },
      include: { category: true },
    });
  }

  /** Admin: create a category. */
  async createCategory(dto: CreateCategoryDto) {
    const slug = slugify(dto.name);
    if (await this.prisma.category.findUnique({ where: { slug } })) {
      throw new BadRequestException(`Category "${dto.name}" already exists`);
    }
    return this.prisma.category.create({ data: { name: dto.name, slug } });
  }
}
