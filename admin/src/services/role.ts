import api from './api';
import type {
  ApiResponse,
  AdminRoleInfo,
  AdminPermissionInfo,
  AdminRoleCreateRequest,
  AdminRoleUpdateRequest,
} from '@wudong/shared';

export function getRoles() {
  return api.get<ApiResponse<AdminRoleInfo[]>>('/admin/roles');
}

export function getRoleDetail(id: number) {
  return api.get<ApiResponse<AdminRoleInfo>>(`/admin/roles/${id}`);
}

export function createRole(data: AdminRoleCreateRequest) {
  return api.post<ApiResponse<AdminRoleInfo>>('/admin/roles', data);
}

export function updateRole(id: number, data: AdminRoleUpdateRequest) {
  return api.put<ApiResponse<AdminRoleInfo>>(`/admin/roles/${id}`, data);
}

export function deleteRole(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/roles/${id}`);
}

export function getPermissions() {
  return api.get<ApiResponse<AdminPermissionInfo[]>>('/admin/roles/permissions');
}
