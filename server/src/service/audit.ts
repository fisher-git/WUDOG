import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { MerchantApplication } from '../entity/merchant_application';
import { Merchant } from '../entity/merchant';
import { ApiResponse, PaginatedData, MerchantApplicationInfo, MerchantApplicationRequest, AuditRequest } from '@wudong/shared';

@Provide()
export class AuditService {
  @InjectEntityModel(MerchantApplication)
  applicationRepo: Repository<MerchantApplication>;

  @InjectEntityModel(Merchant)
  merchantRepo: Repository<Merchant>;

  async submitApplication(data: MerchantApplicationRequest): Promise<ApiResponse<MerchantApplicationInfo>> {
    const app = await this.applicationRepo.save({
      userId: 0, // 从ctx获取
      shopName: data.shopName,
      module: data.module,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail || '',
      shopDescription: data.shopDescription || '',
      materials: data.materials || [],
      status: 'pending',
    });

    return { code: 200, message: '申请已提交，请等待审核', data: app as any };
  }

  async getApplicationList(page: number, pageSize: number, status?: string): Promise<ApiResponse<PaginatedData<MerchantApplicationInfo>>> {
    const where: any = {};
    if (status) where.status = status;

    const [list, total] = await this.applicationRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      code: 200,
      message: '查询成功',
      data: {
        list: list.map(a => ({
          id: a.id,
          userId: a.userId,
          shopName: a.shopName,
          module: a.module as any,
          contactName: a.contactName,
          contactPhone: a.contactPhone,
          contactEmail: a.contactEmail || '',
          shopDescription: a.shopDescription || '',
          materials: a.materials || [],
          status: a.status as any,
          reviewerId: a.reviewerId,
          reviewComment: a.reviewComment || '',
          reviewedAt: a.reviewedAt?.toISOString() || '',
          createdAt: a.createdAt.toISOString(),
        })),
        total,
        page,
        pageSize,
      },
    };
  }

  async getApplicationDetail(id: number): Promise<ApiResponse<MerchantApplicationInfo>> {
    const app = await this.applicationRepo.findOne({ where: { id } });
    if (!app) {
      return { code: 404, message: '申请不存在', data: null as any };
    }
    return {
      code: 200,
      message: '查询成功',
      data: {
        id: app.id,
        userId: app.userId,
        shopName: app.shopName,
        module: app.module as any,
        contactName: app.contactName,
        contactPhone: app.contactPhone,
        contactEmail: app.contactEmail || '',
        shopDescription: app.shopDescription || '',
        materials: app.materials || [],
        status: app.status as any,
        reviewerId: app.reviewerId,
        reviewComment: app.reviewComment || '',
        reviewedAt: app.reviewedAt?.toISOString() || '',
        createdAt: app.createdAt.toISOString(),
      },
    };
  }

  async auditApplication(id: number, reviewerId: number, req: AuditRequest): Promise<ApiResponse<null>> {
    const app = await this.applicationRepo.findOne({ where: { id } });
    if (!app) {
      return { code: 404, message: '申请不存在', data: null };
    }
    if (app.status !== 'pending') {
      return { code: 400, message: '该申请已处理', data: null };
    }

    if (req.action === 'approve') {
      const module = req.module || app.module;
      app.status = 'approved';
      app.reviewerId = reviewerId;
      app.reviewedAt = new Date();
      await this.applicationRepo.save(app);

      // 创建商家账号
      const defaultPassword = await bcrypt.hash('123456', 12);
      const merchant = await this.merchantRepo.save({
        username: `merchant_${app.shopName}`.substring(0, 50),
        passwordHash: defaultPassword,
        shopName: app.shopName,
        module: module,
        contactName: app.contactName,
        contactPhone: app.contactPhone,
        contactEmail: app.contactEmail,
        shopDescription: app.shopDescription,
        status: 'active',
        settledAt: new Date(),
      });

      return { code: 200, message: `审核通过，商家账号已创建: ${merchant.username}`, data: null };
    } else {
      app.status = 'rejected';
      app.reviewerId = reviewerId;
      app.reviewComment = req.reason || '';
      app.reviewedAt = new Date();
      await this.applicationRepo.save(app);

      return { code: 200, message: '已驳回申请', data: null };
    }
  }
}
