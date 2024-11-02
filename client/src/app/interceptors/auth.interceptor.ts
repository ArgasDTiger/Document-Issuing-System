import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authService = inject(AuthService);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthUrl = req.url.includes(`${environment.apiUrl}/auth/login`) ||
        req.url.includes(`${environment.apiUrl}/auth/register`);

      if (error.status === 401 && !isAuthUrl && token) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
