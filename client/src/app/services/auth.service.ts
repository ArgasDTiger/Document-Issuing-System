import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import {AbstractControl, ValidationErrors, ɵElement, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";

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
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadCurrentUser(token).subscribe();
    }
  }

    login(credentials: ɵTypedOrUntyped<{
        [K in keyof {
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }]: ɵElement<{
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }[K], null>
    }, ɵFormGroupValue<{
        [K in keyof {
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }]: ɵElement<{
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }[K], null>
    }>, any>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials).pipe(
      tap(user => this.handleAuthSuccess(user))
    );
  }

  loadCurrentUser(token: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/current`).pipe(
      tap(user => this.handleAuthSuccess(user))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(user: User): void {
    if (user?.token) {
      localStorage.setItem('token', user.token);
      this.currentUserSubject.next(user);
    }
  }
}
