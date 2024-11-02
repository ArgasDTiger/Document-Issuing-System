import { Component, computed, inject } from '@angular/core';
import { DocumentService } from "../../services/document.service";
import { DatePipe } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, switchMap, merge, startWith } from "rxjs";
import { User } from "../../models/user";
import { FilterState } from "../../models/filter-state";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [DatePipe, ModalComponent],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  private userService = inject(UserService);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);

  isModalVisible = false;
  documentToComplete: { userLogin: string; documentId: string } | null = null;

  private refreshTrigger = new Subject<void>();

  private filterState = new BehaviorSubject<FilterState>({
    search: '',
    sortField: '',
    sortDirection: 'asc',
    pageNumber: 1,
    pageSize: 10
  });

  currentEmployee = toSignal(this.authService.currentUser$);

  private users = toSignal(
    merge(
      this.filterState.pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) =>
          prev.search === curr.search &&
          prev.sortField === curr.sortField &&
          prev.sortDirection === curr.sortDirection &&
          prev.pageNumber === curr.pageNumber
        )
      ),
      this.refreshTrigger.pipe(
        switchMap(() => this.filterState)
      )
    ).pipe(
      startWith(this.filterState.value),
      switchMap(filter =>
        this.userService.getAllUsers(
          filter.sortField,
          filter.sortDirection,
          filter.search,
          { pageNumber: filter.pageNumber, pageSize: filter.pageSize }
        )
      )
    ),
    { initialValue: { items: [] as User[], totalPages: 0, pageNumber: 1, hasNext: false, hasPrevious: false } }
  );

  activeDocuments = computed(() => {
    const users = this.users().items;
    const currentDepartmentId = this.currentEmployee()?.department?.id;

    if (!currentDepartmentId) {
      return [];
    }

    return users
      .filter(user => user.documents?.length >= 0)
      .flatMap(user =>
        (user.documents || [])
          .filter(doc =>
            (doc.status === 'On process' || doc.status === 'Received') &&
            doc.departmentName === this.currentEmployee()?.department?.name
          )
          .map(doc => ({
            ...doc,
            name: doc.documentName,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            userLogin: user.login
          }))
      );
  });

  currentPage = computed(() => this.users().pageNumber);
  totalPages = computed(() => this.users().totalPages);
  hasNextPage = computed(() => this.users().hasNext);
  hasPreviousPage = computed(() => this.users().hasPrevious);

  completeDocument(userLogin: string, documentId: string) {
    this.documentService.completeDocument(userLogin, documentId)
      .subscribe({
        next: () => {
          this.refreshTrigger.next();
        },
        error: (error) => {
          console.error('Error completing document:', error);
          alert('Помилка при оновленні статусу документа');
        }
      });
  }

  openModal(userLogin: string, documentId: string) {
    this.documentToComplete = { userLogin, documentId };
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.documentToComplete = null;
  }

  confirmAction() {
    if (this.documentToComplete) {
      const { userLogin, documentId } = this.documentToComplete;
      this.completeDocument(userLogin, documentId);
      this.closeModal();
    }
  }

  onSortDirectionChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.updateFilterState({ sortDirection: select.value as 'asc' | 'desc' });
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.updateFilterState({ sortField: select.value });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.updateFilterState({ search: input.value });
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.updateFilterState({ pageNumber: newPage });
    }
  }

  private updateFilterState(update: Partial<FilterState>) {
    this.filterState.next({
      ...this.filterState.value,
      ...update
    });
  }
}
