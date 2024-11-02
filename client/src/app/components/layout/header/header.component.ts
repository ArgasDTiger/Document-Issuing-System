import { Component, inject } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { RouterLink, RouterLinkActive } from "@angular/router";
import {ModalComponent} from "../../modal/modal.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ModalComponent
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private authService = inject(AuthService);

  isLoggedIn = toSignal(
    this.authService.currentUser$.pipe(
      map(user => !!user)
    ),
    { initialValue: false }
  );

  userFullName = toSignal(
    this.authService.currentUser$.pipe(
      map(user => user ? `${user.firstName} ${user.middleName}` : '')
    ),
    { initialValue: '' }
  );

  showLogoutModal = false;

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    this.authService.logout();
    this.closeLogoutModal();
  }
}
