import { Controller, Put, Body, Inject, Context } from '@midwayjs/core';
import { MerchantWorkbenchService } from '../../service/merchant_workbench';

@Controller('/merchant/account')
export class MerchantAccountController {
  @Inject() workbenchService: MerchantWorkbenchService;

  @Put('/password')
  async updatePassword(@Body() body: { oldPassword: string; newPassword: string }, @Context() ctx: any) {
    return this.workbenchService.updatePassword(ctx.currentUser?.userId || 0, body.oldPassword, body.newPassword);
  }
}
