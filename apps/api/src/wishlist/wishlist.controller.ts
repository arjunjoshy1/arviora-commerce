import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { IsString } from 'class-validator';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

class AddWishlistItemDto {
  @IsString()
  productId!: string;
}

// All wishlist routes require a signed-in user.
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  myWishlist(@CurrentUser() user: User) {
    return this.wishlist.findAllForUser(user.id);
  }

  @Post()
  add(@CurrentUser() user: User, @Body() dto: AddWishlistItemDto) {
    return this.wishlist.add(user.id, dto.productId);
  }

  @Delete(':productId')
  remove(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.wishlist.remove(user.id, productId);
  }
}
