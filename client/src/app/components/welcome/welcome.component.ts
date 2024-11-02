import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink,
    NgSwitch,
    NgSwitchCase
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: User | null = null;
  userStatus: string = '';

  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.updateUserStatus();
    });
  }

  private updateUserStatus() {
    if (!this.user) {
      this.userStatus = 'unauthorized';
    } else {
      switch (this.user.role.toLowerCase()) {
        case 'admin':
          this.userStatus = 'admin';
          break;
        case 'employee':
          this.userStatus = 'employee';
          break;
        case 'user':
          this.userStatus = 'user';
          break;
        default:
          this.userStatus = 'unauthorized';
          break;
      }
    }
  }
}
