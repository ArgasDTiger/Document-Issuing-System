import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { PasswordResetService } from "../../../services/password-reset.service";
import { LoginCredentials } from "../../../models/login-credentials";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private passwordResetService = inject(PasswordResetService);
  private router = inject(Router);

  showPassword = signal(false);
  showRecovery = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  loginForm = this.fb.group({
    userLogin: ['', Validators.required],
    password: ['', Validators.required]
  });

  recoveryForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const credentials: LoginCredentials = {
        userLogin: this.loginForm.get('userLogin')?.value || '',
        password: this.loginForm.get('password')?.value || ''
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          if (response) {
            this.isLoading.set(false);
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error instanceof Error) {
            this.errorMessage.set(error.message);
          } else {
            this.errorMessage.set('Помилка входу в систему');
          }
        }
      });
    } else {
      this.errorMessage.set('Будь ласка, заповніть всі обов\'язкові поля');
    }
  }

  onRecoverySubmit() {
    if (this.recoveryForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const email = this.recoveryForm.get('email')?.value;

      this.passwordResetService.forgotPassword(email as string).subscribe({
        next: (response) => {
          this.successMessage.set(response.message || 'На вашу електронну пошту надіслано посилання для відновлення паролю.');
          this.isLoading.set(false);

          this.recoveryForm.reset();

          setTimeout(() => {
            this.showRecovery.set(false);
            this.successMessage.set('');
          }, 3000);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Виникла помилка при відправці листа. Спробуйте пізніше.');
        }
      });
    }
  }

  resetMessages() {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelRecovery() {
    this.showRecovery.set(false);
    this.resetMessages();
    this.recoveryForm.reset();
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }
}
