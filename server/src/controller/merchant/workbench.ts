import { Controller, Get, Inject, Context } from '@midwayjs/core';
import { MerchantWorkbenchService } from '../../service/merchant_workbench';

@Controller('/merchant/workbench')
export class MerchantWorkbenchController {
  @Inject() workbenchService: MerchantWorkbenchService;

  @Get('/')
  async getWorkbench(@Context() ctx: any) {
    return this.workbenchService.getWorkbench(ctx.currentUser?.userId || 0);
  }
}
