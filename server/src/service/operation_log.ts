import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AdminOperationLog } from '../entity/admin_operation_log';
import { ApiResponse, PaginatedData } from '@wudong/shared';

@Provide()
export class OperationLogService {
  @InjectEntityModel(AdminOperationLog)
  logRepo: Repository<AdminOperationLog>;

  async getLogs(page: number, pageSize: number, operatorId?: number, actionType?: string, startDate?: string, endDate?: string): Promise<ApiResponse<PaginatedData<any>>> {
    const where: any = {};
    if (operatorId) where.operatorId = operatorId;
    if (actionType) where.actionType = actionType;
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [list, total] = await this.logRepo.findAndCount({
      where, skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' },
    });

    return {
      code: 200, message: '查询成功',
      data: {
        list: list.map(l => ({
          id: l.id, operatorId: l.operatorId, operatorName: l.operatorName,
          actionType: l.actionType, targetType: l.targetType, targetId: l.targetId,
          actionDetail: l.actionDetail, ip: l.ip, createdAt: l.createdAt.toISOString(),
        })),
        total, page, pageSize,
      },
    };
  }
}
