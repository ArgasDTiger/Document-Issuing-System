import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
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

  userRole = toSignal(
    this.authService.currentUser$.pipe(
      map(user => user?.role)
    ),
    { initialValue: null }
  );

  logout() {
    this.authService.logout();
  }
}
