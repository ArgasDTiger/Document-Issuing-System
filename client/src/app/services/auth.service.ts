import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string>('');

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  login(role: string) {
    this.isLoggedInSubject.next(true);
    this.userRoleSubject.next(role);
  }

  logout() {
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next('');
  }
}
