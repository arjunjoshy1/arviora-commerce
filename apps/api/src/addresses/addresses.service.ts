import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import type { Address as ApiAddress } from '@arviora/shared';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertAddressDto } from './dto/address.dto';

export function toApiAddress(address: Address): ApiAddress {
  return {
    id: address.id,
    label: address.label,
    name: address.name,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    isDefault: address.isDefault,
  };
}

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }

  private async assertOwned(userId: string, id: string): Promise<void> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId !== userId) throw new ForbiddenException();
  }

  async create(userId: string, dto: UpsertAddressDto): Promise<Address> {
    if (dto.isDefault) await this.clearDefault(userId);
    return this.prisma.address.create({
      data: { ...dto, userId },
    });
  }

  async update(
    userId: string,
    id: string,
    dto: UpsertAddressDto,
  ): Promise<Address> {
    await this.assertOwned(userId, id);
    if (dto.isDefault) await this.clearDefault(userId);
    return this.prisma.address.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.assertOwned(userId, id);
    await this.prisma.address.delete({ where: { id } });
  }

  private async clearDefault(userId: string): Promise<void> {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}
