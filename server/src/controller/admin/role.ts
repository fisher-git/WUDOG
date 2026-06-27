import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';
import { RoleService } from '../../service/role';
import { LogOperation } from '../../middleware/operation_log';

@Controller('/admin/roles')
export class AdminRoleController {
  @Inject() roleService: RoleService;

  @Get('/')
  async getRoles(): Promise<ApiResponse<any>> { return this.roleService.getRoleList(); }

  @Post('/')
  @LogOperation('role_create', 'role')
  async createRole(@Body() body: { name: string; description: string; permissionIds: number[] }): Promise<ApiResponse<any>> {
    return this.roleService.createRole(body.name, body.description, body.permissionIds);
  }

  @Put('/:id')
  @LogOperation('role_update', 'role')
  async updateRole(@Param('id') id: number, @Body() body: { name: string; description: string; permissionIds: number[] }): Promise<ApiResponse<null>> {
    return this.roleService.updateRole(id, body.name, body.description, body.permissionIds);
  }

  @Delete('/:id')
  @LogOperation('role_delete', 'role')
  async deleteRole(@Param('id') id: number): Promise<ApiResponse<null>> { return this.roleService.deleteRole(id); }

  @Get('/permissions')
  async getPermissions(): Promise<ApiResponse<any>> { return this.roleService.getPermissionTree(); }
}
