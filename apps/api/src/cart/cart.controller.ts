import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CartService } from './cart.service';
import { SyncCartDto, UpsertCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// All cart routes require a signed-in user — guests keep their cart locally.
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  myCart(@CurrentUser() user: User) {
    return this.cart.findAllForUser(user.id);
  }

  @Post('sync')
  sync(@CurrentUser() user: User, @Body() dto: SyncCartDto) {
    return this.cart.sync(user.id, dto.items);
  }

  @Put('items')
  upsertItem(@CurrentUser() user: User, @Body() dto: UpsertCartItemDto) {
    return this.cart.upsert(user.id, dto.productId, dto.size, dto.quantity);
  }

  @Delete('items')
  removeItem(
    @CurrentUser() user: User,
    @Query('productId') productId: string,
    @Query('size') size: string,
  ) {
    return this.cart.remove(user.id, productId, size);
  }

  @Delete()
  clear(@CurrentUser() user: User) {
    return this.cart.clear(user.id);
  }
}
