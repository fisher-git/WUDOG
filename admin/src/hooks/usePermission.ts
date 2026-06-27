import { useMemo } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions, getPermissions } from '../utils/permissions';

export function usePermission() {
  const permissions = useMemo(() => getPermissions(), []);

  const can = useMemo(
    () => (permCode: string) => hasPermission(permCode),
    [permissions],
  );

  const canAny = useMemo(
    () => (permCodes: string[]) => hasAnyPermission(permCodes),
    [permissions],
  );

  const canAll = useMemo(
    () => (permCodes: string[]) => hasAllPermissions(permCodes),
    [permissions],
  );

  return {
    permissions,
    can,
    canAny,
    canAll,
  };
}
