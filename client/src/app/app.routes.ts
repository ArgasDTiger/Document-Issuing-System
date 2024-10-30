// routes.ts
import { Routes } from '@angular/router';
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EmployeeComponent } from "./components/employee/employee.component";
import { AdminComponent } from "./components/admin/admin.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [roleGuard(['guest'])]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard(['user'])]
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [roleGuard(['employee'])]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard(['admin'])]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
