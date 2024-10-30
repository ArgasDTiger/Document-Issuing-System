import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from "../models/user";
import { LoginCredentials } from "../models/login-credentials";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  initAuth(): void {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    if (!this.isTokenValid(token)) {
      this.logout();
      return;
    }

    this.loadCurrentUser(token).subscribe({
      next: (user) => this.setCurrentUser({ ...user, token }),
      error: (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      }
    });
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return false;
      }

      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials).pipe(
      tap(user => this.handleAuthSuccess(user)),
      catchError(error => throwError(() => error))
    );
  }

  private loadCurrentUser(token: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  private handleAuthSuccess(user: User): void {
    if (!user?.token || !this.isTokenValid(user.token)) {
      return;
    }

    localStorage.setItem('token', user.token);
    this.setCurrentUser(user);
    this.navigateBasedOnRole(user.role);
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  }

  private navigateBasedOnRole(role: string): void {
    const routes: { [key: string]: string } = {
      admin: '/admin',
      employee: '/employee',
      default: '/'
    };
    this.router.navigate([routes[role.toLowerCase()] || routes.default]);
  }

  private setCurrentUser(user: User | null): void {
    console.log(JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setCurrentUser(null);
    this.router.navigate(['/welcome']);
  }
}
