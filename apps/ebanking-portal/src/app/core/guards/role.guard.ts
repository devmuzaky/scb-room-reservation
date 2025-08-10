import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/auth/api/auth.service';
import { Role } from '@/core/store/auth-store';

export function createRoleGuard(allowedRoles: Role | Role[] | string | string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRoles = authService.getRolesFromToken();

    if (!userRoles || userRoles.length === 0) {
      return router.createUrlTree(['/not-found-404']);
    }

    const requiredRoles = normalizeRoles(allowedRoles);
    const hasPermission = userRoles.some(userRole => requiredRoles.includes(userRole as any));

    if (hasPermission) {
      return true;
    }
    return router.createUrlTree(['/not-found-404']);
  };
}

function normalizeRoles(roles: Role | Role[] | string | string[]): Role[] {
  let roleArray: Role[];

  if (Array.isArray(roles)) {
    roleArray = roles as Role[];
  } else {
    roleArray = [roles as Role];
  }

  const expandedRoles: Role[] = [];

  for (const role of roleArray) {
    if (role === ('CHECKER' as Role)) {
      expandedRoles.push('CHECKER_LEVEL_1', 'CHECKER_LEVEL_2', 'CHECKER_LEVEL_3');
    } else {
      expandedRoles.push(role);
    }
  }

  return expandedRoles;
}
