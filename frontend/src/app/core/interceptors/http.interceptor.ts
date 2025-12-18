import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private readonly API_BASE = 'http://localhost:3000/api';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only intercept API requests
    if (request.url.startsWith(this.API_BASE)) {
      // Clone request and add withCredentials for cookies
      const clonedRequest = request.clone({
        withCredentials: true
      });

      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        })
      );
    }

    return next.handle(request);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      // Unauthorized - clear auth and redirect to login
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      // Forbidden - redirect to home
      this.router.navigate(['/']);
    }

    // Return error with backend message
    let errorMessage = 'An error occurred';
    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({ message: errorMessage, status: error.status }));
  }
}

