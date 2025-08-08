import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import {
  LoginRequest,
  LoginResponse,
  AuthUser,
  AuthErrorType,
  SetPasswordResponse,
  SetPasswordRequest,
} from '@/models/auth.model';
import { UserRole } from '@/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = '/api';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');

    if (token && userData) {
      try {
        const user = JSON.parse(userData) as AuthUser;
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  /**
   * Login user with API integration
   */
  login(credentials: LoginRequest): Observable<AuthUser> {
    // For development - use mock data until API is ready
    if (this.isDevelopmentMode()) {
      return this.mockLogin(credentials);
    }

    // Real API call
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          const user = this.processLoginResponse(response);
          this.handleLoginSuccess(user, response.token);
        }),
        map((response) => this.processLoginResponse(response)),
        catchError((error) => this.handleLoginError(error))
      );
  }



 

  /**
   * Mock login for development (remove when API is ready)
   */
  private mockLogin(credentials: LoginRequest): Observable<AuthUser> {
    return new Observable<AuthUser>((subscriber) => {
      setTimeout(() => {
        try {
          const user = this.authenticateCredentialsMock(credentials);
          const mockToken = 'mock-jwt-token-' + Date.now();
          this.handleLoginSuccess(user, mockToken);
          subscriber.next(user);
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      }, 1000);
    });
  }

  /**
   * Mock credential validation (remove when API is ready)
   */
  private authenticateCredentialsMock(credentials: LoginRequest): AuthUser {
    const users = [
      {
        email: 'admin@gmail.com',
        password: 'Admin123!',
        user: {
          email: 'admin@gmail.com',
          role: UserRole.ADMIN,
        },
      },
      {
        email: 'staff@test.com',
        password: 'Staff123!',
        user: {
          email: 'staff@test.com',
          role: UserRole.STAFF,
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
        message: 'Invalid email or password. Please check your credentials.',
      };
    }

    return matchedUser.user;
  }

  /**
   * Process API login response
   */
  private processLoginResponse(response: LoginResponse): AuthUser {
    return {
      email: response.user.email,
      role: response.user.role === 'admin' ? UserRole.ADMIN : UserRole.STAFF,
    };
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(user: AuthUser, token: string): void {
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Update current user state
    this.currentUserSubject.next(user);

    // Navigate to appropriate page
    const defaultRoute = this.getDefaultRouteForUser(user);
    this.router.navigate([defaultRoute]);
  }

 

  /**
   * Handle login errors
   */
  private handleLoginError(error: any): Observable<never> {
    let errorMessage = 'Login failed. Please try again.';
    let errorType = AuthErrorType.INVALID_CREDENTIALS;

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    
      // Map API error messages to error types
      if (error.status === 401) {
        if (error.error.message.includes('locked')) {
          errorType = AuthErrorType.ACCOUNT_LOCKED;
          errorMessage =
            'Account locked after 5 failed attempts. Try again in 20 minutes.';
        } else {
          errorType = AuthErrorType.INVALID_CREDENTIALS;
          errorMessage = 'Invalid email or password.';
        }
      }
    }

    return throwError(() => ({
      type: errorType,
      message: errorMessage,
    }));
  }
 

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!localStorage.getItem('authToken');
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get default route for user based on role
   * Updated to route admin to manage-requests as requested
   */
  getDefaultRouteForUser(user: AuthUser): string {
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin/manage-requests'; // Changed from manage-people
      case UserRole.STAFF:
        return '/dashboard/calendar';
      default:
        return '/auth/login';
    }
  }

  /**
   * Check if in development mode
   */
  private isDevelopmentMode(): boolean {
    // Return true to use mock data, false to use real API
    return false; // Change to false when API is ready
  }

  // Activation 
   activate(credentials:SetPasswordRequest): Observable<SetPasswordResponse> {
    return this.http
      .post<SetPasswordResponse>(`${this.apiUrl}/auth/set-password`, credentials)
      .pipe(
        tap((response) => {
          this.handleActivationSuccess(response);
        }),
       catchError((error) => this.handleActivationError(error))
      );
  }

   private handleActivationSuccess(response: SetPasswordResponse): void {
    this.router.navigate(['/auth/login'])
  }

   handleActivationError(error: any): Observable<never> {
    let errorMessage = 'Activation failed. Please try again.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    // if(error.status === 404) {
    //   errorMessage = 'Invalid activation token. Please request a new one.';
    // }
    return throwError(() => ({
      message: errorMessage,
    }));

  }

}
