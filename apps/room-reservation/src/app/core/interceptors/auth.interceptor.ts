import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '@/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    // Clone request and add headers
    let modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });

    // Add Authorization header if token exists and this is an API call
    if (token && this.isApiCall(request.url)) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 errors (unauthorized)
        if (error.status === 401 && this.isApiCall(request.url)) {
          // Clear auth data and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          this.router.navigate(['/auth/login']);
        }

        return throwError(() => error);
      })
    );
  }

  /**
   * Check if the request is an API call
   */
  private isApiCall(url: string): boolean {
    return url.startsWith('/api') || url.includes('/api/');
  }
}
