import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from "../../services/user.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { User } from "../../models/user";
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { DocumentService } from "../../services/document.service";
import {AddUserComponent} from "./add-user/add-user.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    AddUserComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private userService = inject(UserService);
  private documentService = inject(DocumentService);

  showConfirmModal = signal(false);
  selectedUserForRoleChange = signal<{userId: string, newRole: string} | null>(null);
  showAddUserModal = signal(false);

  private filterState = new BehaviorSubject({
    search: '',
    roleFilter: 'all',
    departmentFilter: 'all',
    sortField: '',
    pageNumber: 1,
    pageSize: 10
  });

  private users = toSignal(
    this.filterState.pipe(
      debounceTime(300),
      distinctUntilChanged(),
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

  filteredUsers = computed(() => {
    const users = this.users().items;
    const { roleFilter, departmentFilter } = this.filterState.value;

    return users.filter(user => {
      const roleMatch = roleFilter === 'all' || user.roles === roleFilter;
      const deptMatch = departmentFilter === 'all' || user.department === departmentFilter;
      return roleMatch && deptMatch;
    });
  });

  currentPage = computed(() => this.users().pageNumber);
  totalPages = computed(() => this.users().totalPages);
  hasNextPage = computed(() => this.users().hasNext);
  hasPreviousPage = computed(() => this.users().hasPrevious);

  onFilterChange(type: 'role' | 'department', value: string) {
    this.updateFilterState({
      [type === 'role' ? 'roleFilter' : 'departmentFilter']: value,
      pageNumber: 1
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.updateFilterState({ search: input.value, pageNumber: 1 });
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.updateFilterState({ pageNumber: newPage });
    }
  }

  private updateFilterState(update: Partial<typeof this.filterState.value>) {
    this.filterState.next({
      ...this.filterState.value,
      ...update
    });
  }

  initiateRoleChange(userLogin: string, newRole: string) {
    this.selectedUserForRoleChange.set({ userId: userLogin, newRole });
    this.showConfirmModal.set(true);
  }

  confirmRoleChange() {
    const change = this.selectedUserForRoleChange();
    if (!change) return;

    this.userService.changeUserRole(change.userId, change.newRole).subscribe({
      next: () => {
        this.showConfirmModal.set(false);
        this.selectedUserForRoleChange.set(null);
        // Refresh the current page
        this.filterState.next(this.filterState.value);
      },
      error: (error) => {
        console.error('Error changing user role:', error);
        alert('Помилка при зміні ролі користувача');
      }
    });
  }

  cancelRoleChange() {
    this.showConfirmModal.set(false);
    this.selectedUserForRoleChange.set(null);
  }

  changeDepartment(userId: string, newDepartment: string) {
    // TODO
  }

  onUserAdded() {
    this.filterState.next(this.filterState.value);
  }
}
