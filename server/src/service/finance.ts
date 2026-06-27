import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SettlementRecord } from '../entity/settlement_record';
import { SettlementSheet } from '../entity/settlement_sheet';
import { PlatformCommissionConfig } from '../entity/platform_commission_config';
import { ApiResponse, PaginatedData, SettlementRecordInfo, SettlementSheetInfo } from '@wudong/shared';

@Provide()
export class FinanceService {
  @InjectEntityModel(SettlementRecord)
  recordRepo: Repository<SettlementRecord>;

  @InjectEntityModel(SettlementSheet)
  sheetRepo: Repository<SettlementSheet>;

  @InjectEntityModel(PlatformCommissionConfig)
  commissionRepo: Repository<PlatformCommissionConfig>;

  async getSettlementList(page: number, pageSize: number, status?: string): Promise<ApiResponse<PaginatedData<SettlementSheetInfo>>> {
    const where: any = {};
    if (status) where.status = status;

    const [list, total] = await this.sheetRepo.findAndCount({
      where, skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' },
    });

    return {
      code: 200, message: '查询成功',
      data: {
        list: list.map(s => ({
          id: s.id, merchantId: s.merchantId, merchantName: s.merchantName, period: s.period,
          totalOrders: s.totalOrders, totalAmount: Number(s.totalAmount), totalCommission: Number(s.totalCommission),
          totalIncome: Number(s.totalIncome), status: s.status as any, createdAt: s.createdAt.toISOString(),
        })),
        total, page, pageSize,
      },
    };
  }

  async generateSettlementSheet(period: string): Promise<ApiResponse<SettlementSheetInfo>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (period === 'T+7' ? 7 : 15));

    // 模拟结算单生成
    const sheet = await this.sheetRepo.save({
      merchantId: 1, merchantName: '测试商家', period,
      totalOrders: 45, totalAmount: 12500, totalCommission: 1250, totalIncome: 11250, status: 'pending',
    });

    return {
      code: 200, message: '结算单生成成功',
      data: {
        id: sheet.id, merchantId: sheet.merchantId, merchantName: sheet.merchantName,
        period: sheet.period, totalOrders: sheet.totalOrders, totalAmount: Number(sheet.totalAmount),
        totalCommission: Number(sheet.totalCommission), totalIncome: Number(sheet.totalIncome),
        status: sheet.status as any, createdAt: sheet.createdAt.toISOString(),
      },
    };
  }

  async confirmSettlement(id: number): Promise<ApiResponse<null>> {
    await this.sheetRepo.update(id, { status: 'confirmed' });
    return { code: 200, message: '结算已确认', data: null };
  }

  async getRecords(page: number, pageSize: number, merchantId?: number): Promise<ApiResponse<PaginatedData<SettlementRecordInfo>>> {
    const where: any = {};
    if (merchantId) where.merchantId = merchantId;

    const [list, total] = await this.recordRepo.findAndCount({
      where, skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' },
    });

    return {
      code: 200, message: '查询成功',
      data: {
        list: list.map(r => ({
          id: r.id, orderId: r.orderId, merchantId: r.merchantId, merchantName: r.merchantName,
          orderAmount: Number(r.orderAmount), commissionRate: Number(r.commissionRate),
          commissionAmount: Number(r.commissionAmount), merchantIncome: Number(r.merchantIncome),
          status: r.status as any, settledAt: r.settledAt?.toISOString() || '', createdAt: r.createdAt.toISOString(),
        })),
        total, page, pageSize,
      },
    };
  }
}
