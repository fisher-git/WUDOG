import { Provide, Inject, Schedule } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { MerchantApplication } from '../entity/merchant_application';

@Provide()
export class AuditReminderScheduler {
  @InjectEntityModel(MerchantApplication)
  applicationRepo: Repository<MerchantApplication>;

  @Schedule({ type: 'worker', cron: '0 9 * * *' })
  async checkOverdueApplications() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const overdueApps = await this.applicationRepo.count({
      where: { status: 'pending', createdAt: LessThan(threeDaysAgo) },
    });

    if (overdueApps > 0) {
      console.log(`[AuditReminder] ${overdueApps} 个商家入驻申请已超过3个工作日未处理，请及时审核！(R11-03)`);
    }
  }
}
