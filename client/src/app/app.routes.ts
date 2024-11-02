import { Routes } from '@angular/router';
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EmployeeComponent } from "./components/employee/employee.component";
import { AdminComponent } from "./components/admin/admin.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { authGuard } from './guards/auth.guard';
import { publicOnlyGuard } from './guards/public-only.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicOnlyGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [publicOnlyGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard(['user'])]
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [authGuard(['employee'])]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard(['admin'])]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
