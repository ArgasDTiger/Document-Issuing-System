import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface PasswordResetResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private readonly baseUrl = `${environment.apiUrl}/passwordreset`;

  constructor(private http: HttpClient) {}

  forgotPassword(email: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${this.baseUrl}/forgot-password`, { email });
  }

  validateResetToken(email: string, token: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${this.baseUrl}/validate-reset-token`, {
      email,
      token
    });
  }

  resetPassword(data: {
    email: string;
    token: string;
    newPassword: string;
  }): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${this.baseUrl}/reset-password`, data);
  }
}
