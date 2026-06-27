import { Controller, Get, Post, Param, Query, Body, Inject } from '@midwayjs/core';
import { OrderService } from '../../service/order';
import { LogOperation } from '../../middleware/operation_log';

@Controller('/admin/orders')
export class AdminOrderController {
  @Inject() orderService: OrderService;

  @Get('/')
  async getOrders(@Query('page') p = 1, @Query('pageSize') ps = 20, @Query('module') module?: string, @Query('status') status?: string, @Query('keyword') keyword?: string) {
    return this.orderService.getGlobalOrders(+p, +ps, module, status, keyword);
  }

  @Get('/:id')
  async getOrderDetail(@Param('id') id: number) { return this.orderService.getOrderDetail(id); }

  @Post('/:id/approve-refund')
  @LogOperation('refund_approve', 'order')
  async approveRefund(@Param('id') id: number) { return this.orderService.approveRefund(id); }

  @Post('/:id/reject-refund')
  @LogOperation('refund_reject', 'order')
  async rejectRefund(@Param('id') id: number, @Body() body: { reason: string }) { return this.orderService.rejectRefund(id, body.reason); }
}
