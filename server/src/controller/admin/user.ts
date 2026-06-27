import { Controller, Get, Put, Param, Query, Inject } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';
import { AdminUserService } from '../../service/admin_user';
import { AdminMerchantService } from '../../service/admin_merchant';
import { LogOperation } from '../../middleware/operation_log';

@Controller('/admin/users')
export class AdminUserController {
  @Inject() userService: AdminUserService;
  @Inject() merchantService: AdminMerchantService;

  @Get('/tourists')
  async getTouristList(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string): Promise<ApiResponse<any>> {
    return this.userService.getAdminList(Number(page), Number(pageSize), keyword);
  }

  @Get('/tourists/:id')
  async getTouristDetail(@Param('id') id: number): Promise<ApiResponse<any>> {
    return this.userService.getAdminDetail(id);
  }

  @Get('/merchants')
  async getMerchantList(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string, @Query('status') status?: string): Promise<ApiResponse<any>> {
    return this.merchantService.getMerchantList(Number(page), Number(pageSize), keyword, status);
  }

  @Get('/merchants/:id')
  async getMerchantDetail(@Param('id') id: number): Promise<ApiResponse<any>> {
    return this.merchantService.getMerchantDetail(id);
  }

  @Put('/merchants/:id/status')
  @LogOperation('merchant_status_update', 'merchant')
  async updateMerchantStatus(@Param('id') id: number, @Query('status') status: string): Promise<ApiResponse<null>> {
    return this.merchantService.updateMerchantStatus(id, status);
  }
}
