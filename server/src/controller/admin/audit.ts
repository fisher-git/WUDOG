import { Controller, Get, Post, Param, Body, Query, Inject, Context } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';
import { AuditService } from '../../service/audit';
import { LogOperation } from '../../middleware/operation_log';

@Controller('/admin/audit')
export class AdminAuditController {
  @Inject() auditService: AuditService;

  @Get('/applications')
  async getApplications(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('status') status?: string): Promise<ApiResponse<any>> {
    return this.auditService.getApplicationList(Number(page), Number(pageSize), status);
  }

  @Get('/applications/:id')
  async getApplicationDetail(@Param('id') id: number): Promise<ApiResponse<any>> {
    return this.auditService.getApplicationDetail(id);
  }

  @Post('/applications/:id/audit')
  @LogOperation('merchant_audit', 'merchant_application')
  async auditApplication(@Param('id') id: number, @Body() body: { action: string; module?: string; reason?: string }, @Context() ctx: any): Promise<ApiResponse<null>> {
    const reviewerId = ctx.currentUser?.userId || 1;
    return this.auditService.auditApplication(id, reviewerId, body as any);
  }
}
