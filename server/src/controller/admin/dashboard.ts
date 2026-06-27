import { Controller, Get, Query, Inject } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';
import { DashboardService } from '../../service/dashboard';

@Controller('/admin/dashboard')
export class AdminDashboardController {
  @Inject() dashboardService: DashboardService;

  @Get('/overview')
  async getOverview(@Query('range') range = 'week'): Promise<ApiResponse<any>> {
    return this.dashboardService.getOverview(range);
  }
}
