import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// All order routes require a signed-in user.
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  place(@CurrentUser() user: User, @Body() dto: PlaceOrderDto) {
    return this.orders.placeOrder(user.id, dto);
  }

  @Get()
  myOrders(@CurrentUser() user: User) {
    return this.orders.findAllForUser(user.id);
  }

  @Get(':id')
  one(@CurrentUser() user: User, @Param('id') id: string) {
    return this.orders.findOne(id, user);
  }
}
