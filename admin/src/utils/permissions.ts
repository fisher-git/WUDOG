const PERMISSIONS_KEY = 'wudong_admin_permissions';

export function getPermissions(): string[] {
  const raw = localStorage.getItem(PERMISSIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function setPermissions(permissions: string[]): void {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
}

export function hasPermission(permCode: string): boolean {
  const perms = getPermissions();
  if (perms.length === 0) return true; // 无权限数据时默认放行
  return perms.includes(permCode) || perms.includes('admin:all');
}

export function hasAnyPermission(permCodes: string[]): boolean {
  return permCodes.some((code) => hasPermission(code));
}

export function hasAllPermissions(permCodes: string[]): boolean {
  return permCodes.every((code) => hasPermission(code));
}
