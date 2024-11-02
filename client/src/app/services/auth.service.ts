import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of, map, finalize } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from "../models/user";
import { LoginCredentials } from "../models/login-credentials";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  private initializationPromise: Promise<void> | null = null;

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  initAuth(): Observable<void> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.isInitializedSubject.next(true);
      return of(void 0);
    }

    if (!this.isTokenValid(token)) {
      this.logout();
      this.isInitializedSubject.next(true);
      return of(void 0);
    }

    return this.loadCurrentUser(token).pipe(
      tap(user => this.setCurrentUser({ ...user, token })),
      map(() => void 0),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.isInitializedSubject.next(true);
      })
    );
  }

  ensureInitialized(): Promise<void> {
    if (this.isInitializedSubject.value) {
      return Promise.resolve();
    }

    if (!this.initializationPromise) {
      this.initializationPromise = new Promise((resolve, reject) => {
        this.initAuth().subscribe({
          next: () => resolve(),
          error: (error) => reject(error)
        });
      });
    }

    return this.initializationPromise;
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
    tap(user => {
      if (!user?.token) {
        throw new Error('Відсутній токен авторизації');
      }
      this.handleAuthSuccess(user);
    }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Помилка входу в систему';

        const errorMap: { [key: string]: string } = {
          'Invalid credentials': 'Неправильний логін або пароль',
          'User not found': 'Користувача не знайдено',
          'Account locked': 'Обліковий запис заблоковано',
          'Account disabled': 'Обліковий запис відключено'
        };

        if (error.error?.message) {
          errorMessage = errorMap[error.error.message] || error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Неправильний логін або пароль';
        } else if (error.status === 403) {
          errorMessage = 'Доступ заборонено';
        }

        return throwError(() => new Error(errorMessage));
      })
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

  private navigateBasedOnRole(role: string) {
    const routes: { [key: string]: string } = {
      admin: '/admin',
      employee: '/employee',
      default: '/'
    };
    const targetRoute = routes[role.toLowerCase()] || routes.default;
    this.router.navigate([targetRoute]);
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setCurrentUser(null);
    this.router.navigate(['/welcome']);
  }
}

