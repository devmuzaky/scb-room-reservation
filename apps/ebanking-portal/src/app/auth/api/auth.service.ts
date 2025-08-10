import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { IdleAlertService } from '@/core/components/idle-alert/idle-alert.service';
import { AuthStore, Role } from '@/core/store/auth-store';
import { ApiResult } from '@/models/api';
import { User } from '@/store/auth-store';

interface LoginReq {
  username: string;
  password: string;
}

export interface LoginRes {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly http = inject(HttpClient);
  readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  readonly idleAlert = inject(IdleAlertService);

  login(data: LoginReq, token: string, key: string): Observable<LoginRes> {
    const params = new HttpParams().set('username', data.username).set('password', data.password);
    const body = params.toString();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'recaptcha-token': token,
      'public-key': key,
    });
    return this.http.post<LoginRes>(`/api/authentication/auth/mobile/login`, body, { headers }).pipe(
      map(response => {
        this.authStore.setTokens(response);
        return response;
      }),
    );
  }

  refreshToken(): Observable<{ accessToken: string; expiresIn: number }> {
    const tokens = this.authStore.tokens();
    if (!tokens.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<{
        accessToken: string;
        expiresIn: number;
      }>('/api/authentication/auth/refresh', { refreshToken: tokens.refreshToken })
      .pipe(
        map(response => {
          this.authStore.setTokens({
            ...tokens,
            accessToken: response.accessToken,
            expiresIn: response.expiresIn,
          });
          return response;
        }),
        catchError(error => {
          this.authStore.clearAuthState();
          this.router.navigate(['/login']);
          return throwError(() => error);
        }),
      );
  }

  me(): Observable<User> {
    return this.http.get<User>(`/api/authentication/auth/me`).pipe(
      map(user => {
        this.authStore.setProfileInfo(user);
        return user;
      }),
    );
  }

  logout(): Observable<ApiResult<null>> {
    return this.http.post<ApiResult<null>>(`/api/authentication/auth/logout`, {}).pipe(
      finalize(() => {
        // Close any idle dialog and reset clientside timers before navigation
        this.idleAlert.closeAll();
        this.authStore.clearAuthState();
        this.router.navigate(['/login'], { replaceUrl: true });
      }),
    );
  }

  getRolesFromToken(): Role[] {
    try {
      const tokens = this.authStore.tokens();
      if (!tokens.accessToken) return [];

      const payload = this.decodeJWT(tokens.accessToken);
      return payload?.realm_access?.roles || [];
    } catch (error) {
      return [];
    }
  }

  private decodeJWT(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      return null;
    }
  }
}
