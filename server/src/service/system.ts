import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from '../entity/system_config';
import { SensitiveWord } from '../entity/sensitive_word';
import { ShippingTemplate } from '../entity/shipping_template';
import { PlatformCommissionConfig } from '../entity/platform_commission_config';
import { ApiResponse } from '@wudong/shared';

@Provide()
export class SystemService {
  @InjectEntityModel(SystemConfig) configRepo: Repository<SystemConfig>;
  @InjectEntityModel(SensitiveWord) sensitiveWordRepo: Repository<SensitiveWord>;
  @InjectEntityModel(ShippingTemplate) shippingRepo: Repository<ShippingTemplate>;
  @InjectEntityModel(PlatformCommissionConfig) commissionRepo: Repository<PlatformCommissionConfig>;

  async getConfig(key: string): Promise<ApiResponse<any>> {
    const config = await this.configRepo.findOne({ where: { configKey: key } });
    return { code: 200, message: '查询成功', data: config?.configValue || null };
  }

  async setConfig(key: string, value: string): Promise<ApiResponse<null>> {
    const existing = await this.configRepo.findOne({ where: { configKey: key } });
    if (existing) {
      await this.configRepo.update(existing.id, { configValue: value });
    } else {
      await this.configRepo.save({ configKey: key, configValue: value });
    }
    return { code: 200, message: '配置已更新', data: null };
  }

  async getCommissionConfigs(): Promise<ApiResponse<any[]>> {
    const configs = await this.commissionRepo.find();
    return {
      code: 200, message: '查询成功',
      data: configs.map(c => ({ id: c.id, module: c.module, commissionRate: Number(c.commissionRate), updatedAt: c.updatedAt.toISOString() })),
    };
  }

  async updateCommissionConfig(id: number, rate: number): Promise<ApiResponse<null>> {
    await this.commissionRepo.update(id, { commissionRate: rate });
    return { code: 200, message: '抽佣比例已更新（仅对新订单生效）', data: null };
  }

  async getSensitiveWords(page: number, pageSize: number): Promise<ApiResponse<any>> {
    const [list, total] = await this.sensitiveWordRepo.findAndCount({
      skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' },
    });
    return { code: 200, message: '查询成功', data: { list, total, page, pageSize } };
  }

  async addSensitiveWord(word: string, category?: string): Promise<ApiResponse<null>> {
    await this.sensitiveWordRepo.save({ word, category: category || '' });
    return { code: 200, message: '添加成功', data: null };
  }

  async deleteSensitiveWord(id: number): Promise<ApiResponse<null>> {
    await this.sensitiveWordRepo.delete(id);
    return { code: 200, message: '删除成功', data: null };
  }

  async batchImportSensitiveWords(words: string[]): Promise<ApiResponse<null>> {
    const entities = words.map(w => ({ word: w }));
    await this.sensitiveWordRepo.save(entities);
    return { code: 200, message: `成功导入${words.length}个敏感词`, data: null };
  }

  async getShippingTemplates(): Promise<ApiResponse<any[]>> {
    const templates = await this.shippingRepo.find();
    return { code: 200, message: '查询成功', data: templates };
  }

  async createShippingTemplate(data: any): Promise<ApiResponse<any>> {
    const tpl = await this.shippingRepo.save(data);
    return { code: 200, message: '创建成功', data: tpl };
  }

  async updateShippingTemplate(id: number, data: any): Promise<ApiResponse<any>> {
    await this.shippingRepo.update(id, data);
    return { code: 200, message: '更新成功', data: null };
  }
}
