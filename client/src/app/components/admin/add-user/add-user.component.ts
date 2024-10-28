import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgIf} from "@angular/common";
import {UserService} from "../../../services/user.service";
import {AddUserForm} from "../../../models/add-user-form";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  @Output() close = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<void>();

  userForm: FormGroup;
  errorMessage = signal<string>('');
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required], { updateOn: 'blur' }],
      middleName: ['', [Validators.required], { updateOn: 'blur' }],
      lastName: ['', [Validators.required], { updateOn: 'blur' }],
      email: ['', [Validators.required, Validators.email], { updateOn: 'blur' }],
      birthdate: ['', [Validators.required], { updateOn: 'blur' }]
    });

  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const userData: AddUserForm = {
      firstName: this.userForm.get('firstName')?.value,
      middleName: this.userForm.get('middleName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      email: this.userForm.get('email')?.value,
      birthdate: this.userForm.get('birthdate')?.value
    };

    this.userService.addUser(userData).subscribe({
      next: () => {
        this.userAdded.emit();
        this.close.emit();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Помилка при створенні користувача');
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onBlur(fieldName: string) {
    this.userForm.get(fieldName)?.markAsTouched();
  }

}
