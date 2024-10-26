import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users = [
    { login: 'ivan_p', name: 'Іван Петренко', role: 'Користувач', department: '-' },
    { login: 'maria_k', name: 'Марія Ковальчук', role: 'Працівник', department: 'Фінанси' },
    { login: 'mr_beast', name: 'Mr Beast', role: 'Працівник', department: 'Особисті довідки' },
  ];

  changeRole(user: any) {
    user.role = user.role === 'Користувач' ? 'Працівник' : 'Користувач';
    user.department = user.role === 'Працівник' ? user.department : '-';
  }

  changeDepartment(user: any, department: string) {
    if (user.role === 'Працівник') {
      user.department = department;
    }
  }
}
