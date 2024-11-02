import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

export function authGuard(allowedRoles?: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return new Observable<boolean>(observer => {
      authService.ensureInitialized()
        .then(() => {
          authService.currentUser$.pipe(
            map(user => {
              if (!user) {
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
              }

              if (!allowedRoles) {
                return true;
              }

              const hasRole = allowedRoles.some(role =>
                role.toLowerCase() === user.role.toLowerCase()
              );

              if (!hasRole) {
                redirectToUserHome(router, user.role);
                return false;
              }

              return true;
            })
          ).subscribe({
            next: (result) => {
              observer.next(result);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        })
        .catch(error => {
          console.error('Auth initialization failed in guard:', error);
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          observer.next(false);
          observer.complete();
        });
    });
  };
}

function redirectToUserHome(router: Router, role: string): void {
  const routes: { [key: string]: string } = {
    admin: '/admin',
    employee: '/employee',
    user: '/dashboard'
  };
  const targetRoute = routes[role.toLowerCase()] || routes.user;
  router.navigate([targetRoute]);
}
