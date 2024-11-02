import { Component, inject, OnInit, signal } from '@angular/core';
import { DepartmentService } from "../../services/department.service";
import { Department } from "../../models/department";
import { DocumentService } from "../../services/document.service";
import { AuthService } from "../../services/auth.service";
import { DatePipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { Document } from "../../models/document";
import { DepartmentCardComponent } from "./department-card/department-card.component";
import { DocumentCardComponent } from "./document-card/document-card.component";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    JsonPipe,
    NgForOf,
    NgIf,
    DepartmentCardComponent,
    DocumentCardComponent,
    ModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);

  departments = toSignal(
    this.departmentService.getAllDepartments(),
    { initialValue: [] as Department[] }
  );

  selectedDepartment = signal<Department | null>(null);
  departmentDocuments = signal<Document[]>([]);
  userDocuments = signal<Document[]>([]);
  currentUserLogin: string | null = null;

  showRequestModal = false;
  documentToRequest: string | null = null;

  ngOnInit() {
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
    const mappedDocuments = (department.documents || []).map(doc => ({
      ...doc,
      documentName: doc.name
    }));
    this.departmentDocuments.set(mappedDocuments);
  }

  getDocumentStatus(documentId: string): string {
    const userDoc = this.userDocuments().find(d => d.id === documentId);
    return userDoc?.status || 'No operations';
  }

  getRequestDate(documentId: string): Date | null {
    const userDoc = this.userDocuments().find(d => d.id === documentId);
    return userDoc?.requestDate ? new Date(userDoc.requestDate) : null;
  }

  getReceivedDate(documentId: string): Date | null {
    const userDoc = this.userDocuments().find(d => d.id === documentId);
    return userDoc?.receivedDate ? new Date(userDoc.receivedDate) : null;
  }

  openRequestModal(documentId: string) {
    this.documentToRequest = documentId;
    this.showRequestModal = true;
  }

  closeRequestModal() {
    this.showRequestModal = false;
    this.documentToRequest = null;
  }

  confirmRequest() {
    if (this.documentToRequest && this.currentUserLogin) {
      this.documentService.requestDocument(this.currentUserLogin, this.documentToRequest)
        .subscribe({
          next: () => {
            this.loadUserDocuments();
            this.closeRequestModal();
          },
          error: () => {
            alert('Помилка при запиті документа');
          }
        });
    }
  }
}
