import { Inject } from '@midwayjs/core';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';
import { AdminOperationLog } from '../entity/admin_operation_log';

export function LogOperation(actionType: string, targetType: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      try {
        const ctx = args[0]?.ctx || args[0];
        const currentUser = ctx?.currentUser;
        if (currentUser && currentUser.role === 'admin') {
          const dataSource = (global as any).__dataSource__;
          if (dataSource) {
            const repo = dataSource.getRepository(AdminOperationLog);
            const targetId = ctx.params?.id || args[1]?.id || null;
            await repo.save({
              operatorId: currentUser.userId,
              operatorName: currentUser.username,
              actionType,
              targetType,
              targetId: targetId ? Number(targetId) : null,
              actionDetail: JSON.stringify(ctx.request?.body || {}),
              ip: ctx.ip || '',
            });
          }
        }
      } catch (e) {
        // 日志记录失败不影响主流程
        console.error('Failed to write operation log:', e);
      }
      return result;
    };
    return descriptor;
  };
}
