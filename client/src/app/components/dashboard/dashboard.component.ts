import { Component, inject, signal } from '@angular/core';
import { DepartmentService } from "../../services/department.service";
import { Department } from "../../models/department";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { Document } from "../../models/document";
import { DocumentService } from "../../services/document.service";
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { DepartmentCardComponent } from "./department-card/department-card.component";
import { DocumentCardComponent } from "./document-card/document-card.component";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    DocumentCardComponent,
    NgForOf,
    NgIf,
    DepartmentCardComponent,
    DocumentCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private departmentService = inject(DepartmentService);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService); // Inject AuthService
  private dialog = inject(Dialog);

  departments = toSignal(this.departmentService.getAllDepartments(), { initialValue: [] as Department[] });
  selectedDepartment = signal<Department | null>(null);
  departmentDocuments = signal<Document[]>([]);
  userDocuments = signal<any[]>([]);
  currentUserLogin: string | null = null;

  constructor() {
    this.loadUserDocuments();
    this.getCurrentUserLogin();
  }

  private getCurrentUserLogin() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserLogin = user?.login || null;
    });
  }

  private loadUserDocuments() {
    this.documentService.getMyDocuments().subscribe(docs => {
      this.userDocuments.set(docs);
    });
  }

  onDepartmentSelect(department: Department) {
    this.selectedDepartment.set(department);
    this.departmentDocuments.set(department.documents || []);
  }

  getDocumentStatus(documentId: string): string {
    const userDoc = this.userDocuments().find(d => d.documentId === documentId);
    return userDoc?.status || 'No operations';
  }

  getRequestDate(documentId: string): Date | null {
    const userDoc = this.userDocuments().find(d => d.documentId === documentId);
    return userDoc?.requestDate ? new Date(userDoc.requestDate) : null;
  }

  getReceivedDate(documentId: string): Date | null {
    const userDoc = this.userDocuments().find(d => d.documentId === documentId);
    return userDoc?.receivedDate ? new Date(userDoc.receivedDate) : null;
  }

  onRequestDocument(documentId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Підтвердження запиту',
        message: 'Ви дійсно бажаєте подати запит на цей документ?'
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result && this.currentUserLogin) { // Use currentUserLogin when requesting the document
        this.documentService.requestDocument(this.currentUserLogin, documentId).subscribe({
          next: () => {
            this.loadUserDocuments();
          },
          error: (error) => {
            console.error('Error requesting document:', error);
            alert('Помилка при запиті документа');
          }
        });
      }
    });
  }
}
