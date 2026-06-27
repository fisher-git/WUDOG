import { Controller, Get, Query, Inject } from '@midwayjs/core';
import { OperationLogService } from '../../service/operation_log';

@Controller('/admin/logs')
export class AdminLogController {
  @Inject() logService: OperationLogService;

  @Get('/')
  async getLogs(@Query('page') p = 1, @Query('pageSize') ps = 20, @Query('operatorId') oid?: number, @Query('actionType') at?: string, @Query('start') start?: string, @Query('end') end?: string) {
    return this.logService.getLogs(+p, +ps, oid, at, start, end);
  }
}
