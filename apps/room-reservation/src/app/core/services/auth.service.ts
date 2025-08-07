import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of, delay } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { LoginRequest, AuthUser, AuthErrorType } from '@/models/auth.model';
import { UserRole } from '@/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData) as AuthUser;
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  /**
   * Authenticate user with credentials
   * Returns Observable for consistent reactive programming
   */
  login(credentials: LoginRequest): Observable<AuthUser> {
    // Create mock authentication observable
    return new Observable<AuthUser>((subscriber) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          const user = this.authenticateCredentials(credentials);
          this.handleLoginSuccess(user);
          subscriber.next(user);
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      }, 1000);
    });
  }

  /**
   * Domain logic: Validate credentials and return user
   * This separates authentication logic from async handling
   */
  private authenticateCredentials(credentials: LoginRequest): AuthUser {
    // Demo user database
    const users = [
      {
        email: 'admin@gmail.com',
        password: 'Admin123!',
        user: {
          id: '1',
          email: 'admin@gmail.com',
          role: UserRole.ADMIN,
          status: 'activated' as any,
        },
      },
      {
        email: 'staff@test.com',
        password: 'Staff123!',
        user: {
          id: '2',
          email: 'staff@test.com',
          role: UserRole.STAFF,
          status: 'activated' as any,
        },
      },
    ];

    const matchedUser = users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!matchedUser) {
      throw {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      };
    }

    return matchedUser.user;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getDefaultRouteForUser(user: AuthUser): string {
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin/manage-people';
      case UserRole.STAFF:
        return '/dashboard/calendar';
      default:
        return '/auth/login';
    }
  }

  private handleLoginSuccess(user: AuthUser): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);

    const defaultRoute = this.getDefaultRouteForUser(user);
    this.router.navigate([defaultRoute]);
  }
}
