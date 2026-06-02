import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(
    @Request() req: any,
    @Body() body: { items: { barcode: string; quantity: number }[] }
  ) {
    const userId = req.user.sub;
    return this.ordersService.createOrder(userId, body.items);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyOrders(@Request() req: any) {
    const userId = req.user.sub;
    return this.ordersService.getMyOrders(userId);
  }
}
