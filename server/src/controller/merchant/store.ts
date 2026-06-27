import { Controller, Get, Put, Body, Inject, Context } from '@midwayjs/core';
import { MerchantWorkbenchService } from '../../service/merchant_workbench';

@Controller('/merchant/store')
export class MerchantStoreController {
  @Inject() workbenchService: MerchantWorkbenchService;

  @Put('/')
  async updateStoreInfo(@Body() body: any, @Context() ctx: any) {
    return this.workbenchService.updateStoreInfo(ctx.currentUser?.userId || 0, body);
  }
}
