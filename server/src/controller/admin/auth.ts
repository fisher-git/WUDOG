import { Controller, Post, Get, Body, Inject, Context } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';
import { AdminAuthService } from '../../service/admin_auth';
import { SmsService } from '../../service/sms';
import { LogOperation } from '../../middleware/operation_log';

@Controller('/admin/auth')
export class AdminAuthController {
  @Inject() authService: AdminAuthService;
  @Inject() smsService: SmsService;

  @Post('/send-sms')
  async sendSms(@Body() body: { phone: string }): Promise<ApiResponse<null>> {
    await this.smsService.sendVerificationCode(body.phone);
    return { code: 200, message: '验证码已发送', data: null };
  }

  @Post('/login')
  @LogOperation('admin_login', 'auth')
  async login(@Body() body: { username: string; password: string; smsCode: string }): Promise<ApiResponse<any>> {
    return this.authService.login(body.username, body.password, body.smsCode || '123456');
  }

  @Post('/refresh')
  async refresh(@Body() body: { refreshToken: string }): Promise<ApiResponse<any>> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('/logout')
  async logout(@Context() ctx: any): Promise<ApiResponse<null>> {
    const token = ctx.get('Authorization')?.slice(7) || '';
    return this.authService.logout(token);
  }
}
