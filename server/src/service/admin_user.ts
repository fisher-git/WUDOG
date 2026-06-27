import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AdminUser } from '../entity/admin_user';
import { ApiResponse, PaginatedData, AdminUserInfo } from '@wudong/shared';

@Provide()
export class AdminUserService {
  @InjectEntityModel(AdminUser)
  adminUserRepo: Repository<AdminUser>;

  async getAdminList(page: number, pageSize: number, keyword?: string): Promise<ApiResponse<PaginatedData<AdminUserInfo>>> {
    const where: any = {};
    if (keyword) {
      where.username = Like(`%${keyword}%`);
    }

    const [list, total] = await this.adminUserRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      code: 200,
      message: '查询成功',
      data: {
        list: list.map(u => ({
          id: u.id,
          username: u.username,
          name: u.name,
          phone: u.phone || '',
          roleId: u.roleId || 0,
          roleName: '',
          status: u.status,
          lastLoginAt: u.lastLoginAt?.toISOString() || '',
          createdAt: u.createdAt.toISOString(),
        })),
        total,
        page,
        pageSize,
      },
    };
  }

  async getAdminDetail(id: number): Promise<ApiResponse<AdminUserInfo>> {
    const user = await this.adminUserRepo.findOne({ where: { id } });
    if (!user) {
      return { code: 404, message: '管理员不存在', data: null as any };
    }
    return {
      code: 200,
      message: '查询成功',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone || '',
        roleId: user.roleId || 0,
        roleName: '',
        status: user.status,
        lastLoginAt: user.lastLoginAt?.toISOString() || '',
        createdAt: user.createdAt.toISOString(),
      },
    };
  }
}
