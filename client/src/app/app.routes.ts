import { Routes } from '@angular/router';
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EmployeeComponent } from "./components/employee/employee.component";
import { AdminComponent } from "./components/admin/admin.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { roleGuard } from './guards/auth.guard';

function authGuard() {

}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [roleGuard(['guest'])]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [roleGuard(['guest'])]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [roleGuard(['guest'])]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard(['user'])]
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [authGuard, roleGuard(['employee'])]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
