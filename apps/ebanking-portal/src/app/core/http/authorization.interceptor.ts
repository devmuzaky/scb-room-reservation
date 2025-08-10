import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@/auth/api/auth.service';
import { AuthStore } from '@/store/auth-store';

const API_NON_AUTH = ['login', 'gen-key', 'verify', 'refresh'];

export const AuthorizationJWTInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip if not an API request
  const isApiRequest = req.url.includes('/api/');

  if (!isApiRequest) {
    return next(req);
  }

  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip auth for non-auth endpoints
  if (API_NON_AUTH.some(endpoint => req.url.includes(endpoint))) {
    return next(req);
  }

  const token = authStore.tokens.accessToken();

  if (!token) {
    return next(req);
  }

  // Clone request and add auth header
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  // Handle the response
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If token expired and we have a refresh token, try to refresh
      if (error.status === 401 && authStore.tokens.refreshToken()) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authStore.tokens.accessToken();
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`),
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
            authStore.clearAuthState();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          }),
        );
      }

      // For any 401 error, redirect to login
      if (error.status === 401) {
        authStore.clearAuthState();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
