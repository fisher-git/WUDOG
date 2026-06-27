import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Merchant } from '../entity/merchant';
import { ApiResponse, PaginatedData, MerchantInfo } from '@wudong/shared';

@Provide()
export class AdminMerchantService {
  @InjectEntityModel(Merchant)
  merchantRepo: Repository<Merchant>;

  async getMerchantList(page: number, pageSize: number, keyword?: string, status?: string): Promise<ApiResponse<PaginatedData<MerchantInfo>>> {
    const where: any = {};
    if (keyword) {
      where.shopName = Like(`%${keyword}%`);
    }
    if (status) {
      where.status = status;
    }

    const [list, total] = await this.merchantRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      code: 200,
      message: '查询成功',
      data: {
        list: list.map(m => ({
          id: m.id,
          username: m.username,
          shopName: m.shopName,
          module: m.module as any,
          contactName: m.contactName,
          contactPhone: m.contactPhone,
          contactEmail: m.contactEmail || '',
          status: m.status as any,
          settledAt: m.settledAt?.toISOString() || '',
          createdAt: m.createdAt.toISOString(),
        })),
        total,
        page,
        pageSize,
      },
    };
  }

  async getMerchantDetail(id: number): Promise<ApiResponse<MerchantInfo>> {
    const merchant = await this.merchantRepo.findOne({ where: { id } });
    if (!merchant) {
      return { code: 404, message: '商家不存在', data: null as any };
    }
    return {
      code: 200,
      message: '查询成功',
      data: {
        id: merchant.id,
        username: merchant.username,
        shopName: merchant.shopName,
        module: merchant.module as any,
        contactName: merchant.contactName,
        contactPhone: merchant.contactPhone,
        contactEmail: merchant.contactEmail || '',
        status: merchant.status as any,
        settledAt: merchant.settledAt?.toISOString() || '',
        createdAt: merchant.createdAt.toISOString(),
      },
    };
  }

  async updateMerchantStatus(id: number, status: string): Promise<ApiResponse<null>> {
    const merchant = await this.merchantRepo.findOne({ where: { id } });
    if (!merchant) {
      return { code: 404, message: '商家不存在', data: null };
    }
    merchant.status = status;
    await this.merchantRepo.save(merchant);
    return { code: 200, message: '状态更新成功', data: null };
  }
}
