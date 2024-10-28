import {Component, inject, signal} from '@angular/core';
import {Department} from "../../models/department";
import {DepartmentService} from "../../services/department.service";
import {AuthService} from "../../services/auth.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {DepartmentCardComponent} from "./department-card/department-card.component";
import {DocumentListComponent} from "./document-list/document-list.component";
import {LoginComponent} from "../auth/login/login.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DepartmentCardComponent,
    DocumentListComponent,
    LoginComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private authService = inject(AuthService);
  private departmentService = inject(DepartmentService);

  departments = toSignal(this.departmentService.getAllDepartments(), { initialValue: [] });
  isLoggedIn = toSignal(
    this.authService.currentUser$.pipe(
      map(user => !!user)
    ),
    { initialValue: false }
  );

  selectedDepartment = signal<Department | null>(null);
  notification = signal(false);
  requestDate = signal('');
  expectedDate = signal('');

  onDepartmentSelect(department: Department) {
    this.selectedDepartment.set(department);
  }

  onDocumentRequest(documentId: string) {
    if (!this.isLoggedIn()) {
      // Redirect to login
      return;
    }

    const now = new Date();
    const expected = new Date();
    expected.setDate(expected.getDate() + 7);

    this.requestDate.set(now.toLocaleDateString());
    this.expectedDate.set(expected.toLocaleDateString());
    this.notification.set(true);
  }
}
