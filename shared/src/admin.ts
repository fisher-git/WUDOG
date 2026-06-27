export interface AdminUserInfo {
  id: number;
  username: string;
  name: string;
  phone: string;
  roleId: number;
  roleName: string;
  status: string;
  lastLoginAt: string;
  createdAt: string;
}

export interface AdminRoleInfo {
  id: number;
  name: string;
  description: string;
  permissions: AdminPermissionInfo[];
  createdAt: string;
}

export interface AdminPermissionInfo {
  id: number;
  code: string;
  name: string;
  group: string;
}

export interface AdminRoleCreateRequest {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface AdminRoleUpdateRequest {
  name?: string;
  description?: string;
  permissionIds?: number[];
}
