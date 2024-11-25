import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgIf} from "@angular/common";
import {DepartmentService} from "../../../services/department.service";
import {AddDepartmentForm} from "../../../models/add-department-form";

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent {
  @Output() close = new EventEmitter<void>();
  @Output() departmentAdded = new EventEmitter<void>();

  departmentForm: FormGroup;
  errorMessage = signal<string>('');
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required], { updateOn: 'blur' }],
      phoneNumber: ['', [Validators.required], { updateOn: 'blur' }],
      email: ['', [Validators.required, Validators.email], { updateOn: 'blur' }],
    });

  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.departmentForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  onSubmit() {
    if (this.departmentForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const departmentData: AddDepartmentForm = {
      name: this.departmentForm.get('name')?.value,
      phoneNumber: this.departmentForm.get('phoneNumber')?.value,
      email: this.departmentForm.get('email')?.value,
    };

    this.departmentService.addDepartment(departmentData).subscribe({
      next: () => {
        this.departmentAdded.emit();
        this.close.emit();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Помилка при створенні відділу');
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
    this.departmentForm.get(fieldName)?.markAsTouched();
  }

}
