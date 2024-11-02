import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../../../services/password-reset.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private passwordResetService = inject(PasswordResetService);

  showPassword = signal(false);
  isLoading = signal(false);
  isValidating = signal(true);
  isTokenValid = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  resetPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });

  private email: string = '';
  private token: string = '';

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.email || !this.token) {
      this.isValidating.set(false);
      this.isTokenValid.set(false);
      return;
    }

    this.passwordResetService.validateResetToken(this.email, this.token).subscribe({
      next: () => {
        this.isValidating.set(false);
        this.isTokenValid.set(true);
      },
      error: () => {
        this.isValidating.set(false);
        this.isTokenValid.set(false);
      }
    });
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  passwordsMismatch(): boolean {
    const password = this.resetPasswordForm.get('password')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && !this.passwordsMismatch()) {
      this.isLoading.set(true);
      const newPassword = this.resetPasswordForm.get('password')?.value;

      this.passwordResetService.resetPassword({
        email: this.email,
        token: this.token,
        newPassword: newPassword as string
      }).subscribe({
        next: () => {
          this.successMessage.set('Пароль успішно змінено! Перенаправлення на сторінку входу...');
          this.isLoading.set(false);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Помилка при зміні паролю. Спробуйте ще раз.');
          this.isLoading.set(false);
        }
      });
    }
  }
}
