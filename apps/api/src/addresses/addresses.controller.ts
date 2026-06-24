import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AddressesService, toApiAddress } from './addresses.service';
import { UpsertAddressDto } from './dto/address.dto';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addresses: AddressesService) {}

  @Get()
  async findAll(@CurrentUser() user: User) {
    const addresses = await this.addresses.findAllForUser(user.id);
    return addresses.map(toApiAddress);
  }

  @Post()
  async create(@CurrentUser() user: User, @Body() dto: UpsertAddressDto) {
    const address = await this.addresses.create(user.id, dto);
    return toApiAddress(address);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpsertAddressDto,
  ) {
    const address = await this.addresses.update(user.id, id, dto);
    return toApiAddress(address);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.addresses.remove(user.id, id);
  }
}
