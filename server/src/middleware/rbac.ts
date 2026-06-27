import { Middleware, IMiddleware, Inject } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';
import { AdminRolePermission } from '../entity/admin_role_permission';
import { AdminPermission } from '../entity/admin_permission';

export function RequirePermission(permissionCode: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const ctx = args[0]?.ctx || args[0];
      const currentUser = ctx?.currentUser;

      if (!currentUser || currentUser.role !== 'admin') {
        ctx.status = 403;
        ctx.body = { code: 403, message: '无权限访问', data: null };
        return;
      }

      // 超级管理员（roleId=1）跳过权限检查
      if (currentUser.roleId === 1) {
        return originalMethod.apply(this, args);
      }

      try {
        const dsManager = (global as any).__dataSource__;
        if (dsManager) {
          const dataSource = dsManager.getDataSource('default');
          const rpRepo = dataSource.getRepository(AdminRolePermission);
          const permRepo = dataSource.getRepository(AdminPermission);

          const permission = await permRepo.findOne({ where: { code: permissionCode } });
          if (!permission) {
            ctx.status = 403;
            ctx.body = { code: 403, message: `权限不存在: ${permissionCode}`, data: null };
            return;
          }

          const mapping = await rpRepo.findOne({
            where: { roleId: currentUser.roleId, permissionId: permission.id },
          });

          if (!mapping) {
            ctx.status = 403;
            ctx.body = { code: 403, message: `无权限: ${permissionCode}`, data: null };
            return;
          }
        }
      } catch (e) {
        console.error('RBAC check error:', e);
      }

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
