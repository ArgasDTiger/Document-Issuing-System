import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const publicOnlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        const userRole = user.role.toLowerCase();
        const routes: { [key: string]: string } = {
          admin: '/admin',
          employee: '/employee',
          user: '/dashboard'
        };
        router.navigate([routes[userRole] || '/dashboard']);
        return false;
      }
      return true;
    })
  );
};
