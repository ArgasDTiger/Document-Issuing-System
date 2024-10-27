import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  showRecovery = signal(false);
  showRecoverySuccess = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  loginForm = this.fb.group({
    userLogin: ['', Validators.required],
    password: ['', Validators.required]
  });

  recoveryForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  newPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => this.errorMessage.set(error.message)
      });
    }
  }

  onRecoverySubmit() {
    if (this.recoveryForm.valid) {
      this.showRecoverySuccess.set(true);
      this.showRecovery.set(false);
    }
  }

  onNewPasswordSubmit() {
    if (this.newPasswordForm.valid) {
      this.successMessage.set('Пароль успішно змінено.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }
}
