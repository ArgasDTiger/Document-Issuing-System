import {CanActivateFn, Router} from "@angular/router";
import {map, take} from "rxjs";
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
      take(1),
      map(user => {
        // Special handling for 'guest' role
        if (allowedRoles.includes('guest')) {
          if (!user) return true;
          redirectToUserHome(router, user.role);
          return false;
        }

        if (!user) {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
          return false;
        }

        const userRole = user.role.toLowerCase();
        const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

        if (normalizedAllowedRoles.includes(userRole)) {
          return true;
        }

        redirectToUserHome(router, userRole);
        return false;
      })
    );
  };
};

function redirectToUserHome(router: Router, role: string): void {
  switch (role.toLowerCase()) {
    case 'admin':
      router.navigate(['/admin']);
      break;
    case 'employee':
      router.navigate(['/employee']);
      break;
    case 'user':
      router.navigate(['/dashboard']);
      break;
    default:
      router.navigate(['/welcome']);
  }
}
