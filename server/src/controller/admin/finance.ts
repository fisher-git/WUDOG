import { Controller, Get, Post, Param, Query, Body, Inject } from '@midwayjs/core';
import { FinanceService } from '../../service/finance';

@Controller('/admin/finance')
export class AdminFinanceController {
  @Inject() financeService: FinanceService;

  @Get('/settlements')
  async getSettlements(@Query('page') p = 1, @Query('pageSize') ps = 20, @Query('status') status?: string) {
    return this.financeService.getSettlementList(+p, +ps, status);
  }

  @Post('/settlements/generate')
  async generateSettlement(@Body() body: { period: string }) {
    return this.financeService.generateSettlementSheet(body.period);
  }

  @Post('/settlements/:id/confirm')
  async confirmSettlement(@Param('id') id: number) {
    return this.financeService.confirmSettlement(id);
  }

  @Get('/records')
  async getRecords(@Query('page') p = 1, @Query('pageSize') ps = 20, @Query('merchantId') mid?: number) {
    return this.financeService.getRecords(+p, +ps, mid);
  }
}
