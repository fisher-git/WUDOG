import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRole } from '../entity/admin_role';
import { AdminPermission } from '../entity/admin_permission';
import { AdminRolePermission } from '../entity/admin_role_permission';
import { ApiResponse, AdminRoleInfo, AdminPermissionInfo } from '@wudong/shared';

@Provide()
export class RoleService {
  @InjectEntityModel(AdminRole)
  roleRepo: Repository<AdminRole>;

  @InjectEntityModel(AdminPermission)
  permissionRepo: Repository<AdminPermission>;

  @InjectEntityModel(AdminRolePermission)
  rolePermissionRepo: Repository<AdminRolePermission>;

  async getRoleList(): Promise<ApiResponse<AdminRoleInfo[]>> {
    const roles = await this.roleRepo.find();
    const result: AdminRoleInfo[] = [];

    for (const role of roles) {
      const mappings = await this.rolePermissionRepo.find({ where: { roleId: role.id } });
      const permIds = mappings.map(m => m.permissionId);
      const permissions = permIds.length > 0
        ? await this.permissionRepo.findByIds(permIds)
        : [];

      result.push({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: permissions.map(p => ({
          id: p.id,
          code: p.code,
          name: p.name,
          group: p.group || '',
        })),
        createdAt: role.createdAt.toISOString(),
      });
    }

    return { code: 200, message: '查询成功', data: result };
  }

  async createRole(name: string, description: string, permissionIds: number[]): Promise<ApiResponse<AdminRoleInfo>> {
    const role = await this.roleRepo.save({ name, description: description || '' });

    if (permissionIds && permissionIds.length > 0) {
      const mappings = permissionIds.map(permId => ({ roleId: role.id, permissionId: permId }));
      await this.rolePermissionRepo.save(mappings);
    }

    return { code: 200, message: '创建成功', data: { id: role.id, name: role.name, description: role.description || '', permissions: [], createdAt: role.createdAt.toISOString() } };
  }

  async updateRole(id: number, name: string, description: string, permissionIds: number[]): Promise<ApiResponse<null>> {
    if (id === 1) {
      return { code: 403, message: '不可修改超级管理员角色', data: null };
    }
    await this.roleRepo.update(id, { name, description });
    await this.rolePermissionRepo.delete({ roleId: id });
    if (permissionIds && permissionIds.length > 0) {
      const mappings = permissionIds.map(permId => ({ roleId: id, permissionId: permId }));
      await this.rolePermissionRepo.save(mappings);
    }
    return { code: 200, message: '更新成功', data: null };
  }

  async deleteRole(id: number): Promise<ApiResponse<null>> {
    if (id === 1) {
      return { code: 403, message: '不可删除超级管理员角色', data: null };
    }
    await this.rolePermissionRepo.delete({ roleId: id });
    await this.roleRepo.delete(id);
    return { code: 200, message: '删除成功', data: null };
  }

  async getPermissionTree(): Promise<ApiResponse<AdminPermissionInfo[]>> {
    const permissions = await this.permissionRepo.find();
    return {
      code: 200,
      message: '查询成功',
      data: permissions.map(p => ({ id: p.id, code: p.code, name: p.name, group: p.group || '' })),
    };
  }
}
