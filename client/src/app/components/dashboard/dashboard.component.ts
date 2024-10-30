import {Component, inject, signal} from '@angular/core';
import {DepartmentService} from "../../services/department.service";
import {Department} from "../../models/department";
import {toSignal} from "@angular/core/rxjs-interop";
import {DepartmentCardComponent} from "./department-card/department-card.component";
import {DocumentListComponent} from "./document-list/document-list.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DepartmentCardComponent,
    DocumentListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private departmentService = inject(DepartmentService);

  departments = toSignal(this.departmentService.getAllDepartments(), { initialValue: [] });
  selectedDepartment = signal<Department | null>(null);
  notification = signal(false);
  requestDate = signal('');
  expectedDate = signal('');

  onDepartmentSelect(department: Department) {
    this.selectedDepartment.set(department);
  }

  onDocumentRequest(documentId: string) {
    const now = new Date();
    const expected = new Date();
    expected.setDate(expected.getDate() + 7);

    this.requestDate.set(now.toLocaleDateString());
    this.expectedDate.set(expected.toLocaleDateString());
    this.notification.set(true);
  }
}
