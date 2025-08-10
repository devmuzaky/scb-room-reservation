import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/store/auth-store';

export const LoginGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  try {
    const isLoggedIn = authStore.isAuthenticated();

    if (isLoggedIn) {
      router.navigate(['/']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Login guard error:', error);
    return false;
  }
};
