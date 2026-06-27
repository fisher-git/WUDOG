import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { MerchantWorkbenchService } from '../../service/merchant_workbench';
import { JwtUtil } from '../../utils/jwt';

@Controller('/merchant/auth')
export class MerchantAuthController {
  @Inject() workbenchService: MerchantWorkbenchService;
  @Inject() jwtUtil: JwtUtil;

  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.workbenchService.login(body.username, body.password, this.jwtUtil);
  }
}
