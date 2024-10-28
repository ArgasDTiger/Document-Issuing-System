import { Component, computed, effect, inject, signal } from '@angular/core';
import { DocumentService } from "../../services/document.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import {UserService} from "../../services/user.service";
import {BehaviorSubject, debounceTime, distinctUntilChanged, switchMap} from "rxjs";
import {User} from "../../models/user";
import {FilterState} from "../../models/filter-state";

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  private userService = inject(UserService);
  private documentService = inject(DocumentService);

  private filterState = new BehaviorSubject<FilterState>({
    search: '',
    sortField: '',
    pageNumber: 1,
    pageSize: 10
  });

  private users = toSignal(
    this.filterState.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) =>
        prev.search === curr.search &&
        prev.sortField === curr.sortField &&
        prev.pageNumber === curr.pageNumber
      ),
      switchMap(filter =>
        this.userService.getAllUsers(
          filter.sortField,
          undefined,
          filter.search,
          { pageNumber: filter.pageNumber, pageSize: filter.pageSize }
        )
      )
    ),
    { initialValue: { items: [] as User[], totalPages: 0, pageNumber: 1, hasNext: false, hasPrevious: false } }
  );

  activeDocuments = computed(() => {
    const users = this.users().items;
    return users
      .filter(user => user.documents?.length >= 0)
      .flatMap(user =>
        user.documents
          .filter(doc => doc.status === 'On process' || doc.status === 'Received')
          .map(doc => ({
            ...doc,
            firstName: user.firstName,
            lastName: user.lastName,
            userLogin: user.login
          }))
      );
  });

  currentPage = computed(() => this.users().pageNumber);
  totalPages = computed(() => this.users().totalPages);
  hasNextPage = computed(() => this.users().hasNext);
  hasPreviousPage = computed(() => this.users().hasPrevious);

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

  completeDocument(userLogin: string, documentId: string) {
    this.documentService.completeDocument(userLogin, documentId)
      .subscribe({
        next: () => {
          // Refresh the current page
          this.filterState.next(this.filterState.value);
        },
        error: (error) => {
          console.error('Error completing document:', error);
          alert('Помилка при оновленні статусу документа');
        }
      });
  }
}
