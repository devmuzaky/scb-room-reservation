import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.hasRole('admin' as any)) {
    return true;
  }

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/dashboard/calendar']);
  } else {
    return router.createUrlTree(['/auth/login']);
  }
};

export const staffGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.hasRole('staff' as any)) {
    return true;
  }

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/admin/manage-people']);
  } else {
    return router.createUrlTree(['/auth/login']);
  }
};
