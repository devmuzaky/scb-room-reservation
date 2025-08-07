import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // For demo purposes, we'll just pass requests through
    // In a real app, you'd add authorization headers here

    const modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });

    return next.handle(modifiedRequest);
  }
}
