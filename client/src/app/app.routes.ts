import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {EmployeeComponent} from "./components/employee/employee.component";
import {AdminComponent} from "./components/admin/admin.component";
import {LoginComponent} from "./components/auth/login/login.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
];
