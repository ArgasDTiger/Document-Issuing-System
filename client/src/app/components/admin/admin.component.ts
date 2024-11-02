import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from "../../services/user.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { User } from "../../models/user";
import {BehaviorSubject, debounceTime, distinctUntilChanged, finalize, switchMap} from "rxjs";
import {AddUserComponent} from "./add-user/add-user.component";
import {DepartmentService} from "../../services/department.service";
import {Department} from "../../models/department";
import {FormsModule} from "@angular/forms";
import {ModalComponent} from "../modal/modal.component";
import {RoleChangeModal} from "../../models/role-change-modal";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    AddUserComponent,
    FormsModule,
    ModalComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private userService = inject(UserService);
  private departmentService = inject(DepartmentService);

  departments = signal<Department[]>([]);

  roleChangeModal = signal<RoleChangeModal>({
    show: false,
    userId: '',
    newRole: '',
    departments: [],
    selectedDepartment: '',
    isLoading: false
  });

  selectedDepartment = '';
  showAddUserModal = signal(false);

  private roleTranslations: { [key: string]: string } = {
    'User': 'Користувач',
    'Employee': 'Працівник'
  };

  private filterState = new BehaviorSubject({
    search: '',
    roleFilter: 'all',
    departmentFilter: 'all',
    sortField: '',
    sortOrder: 'asc',
    pageNumber: 1,
    pageSize: 10
  });

  constructor() {
    this.departmentService.getAllDepartments().subscribe(deps => {
      this.departments.set(deps);
    });
  }

  private users = toSignal(
    this.filterState.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(filter =>
        this.userService.getAllUsers(
          filter.sortField,
          filter.sortOrder,
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
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const deptMatch = departmentFilter === 'all' ||
        (user.department?.id === departmentFilter);
      return roleMatch && deptMatch;
    });
  });

  translateRole(role: string): string {
    return this.roleTranslations[role] || role;
  }

  currentPage = computed(() => this.users().pageNumber);
  totalPages = computed(() => this.users().totalPages);
  hasNextPage = computed(() => this.users().hasNext);
  hasPreviousPage = computed(() => this.users().hasPrevious);

  onSortDirectionChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const sortDirection = select.value;
    this.updateFilterState({ sortOrder: sortDirection });
  }

  onFilterChange(type: 'role' | 'department', value: string) {
    this.updateFilterState({
      [type === 'role' ? 'roleFilter' : 'departmentFilter']: value,
      pageNumber: 1
    });
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.updateFilterState({ sortField: select.value });
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

  async initiateRoleChange(userId: string, newRole: string) {
    if (newRole === 'Employee') {
      this.departmentService.getAllDepartments().subscribe(departments => {
        this.roleChangeModal.set({
          show: true,
          userId,
          newRole,
          departments,
          selectedDepartment: ''
        });
      });
    } else {
      this.roleChangeModal.set({
        show: true,
        userId,
        newRole
      });
    }
  }

  confirmRoleChange() {
    const modal = this.roleChangeModal();

    if (modal.newRole === 'Employee' && !this.selectedDepartment) {
      return;
    }

    this.roleChangeModal.update(state => ({
      ...state,
      isLoading: true
    }));

    this.userService.changeUserRole(modal.userId, modal.newRole)
      .pipe(
        finalize(() => {
          this.roleChangeModal.update(state => ({
            ...state,
            isLoading: false
          }));
        })
      )
      .subscribe({
        next: () => {
          if (modal.newRole === 'Employee' && this.selectedDepartment) {
            this.departmentService.changeDepartment({
              userId: modal.userId,
              departmentId: this.selectedDepartment
            }).subscribe({
              next: () => {
                this.onRoleChangeSuccess();
              },
              error: (error) => {
                console.error('Error changing department:', error);
                alert('Помилка при зміні відділу користувача');
              }
            });
          } else {
            this.onRoleChangeSuccess();
          }
        },
        error: (error) => {
          console.error('Error changing user role:', error);
          alert('Помилка при зміні ролі користувача');
        }
      });
  }

  private onRoleChangeSuccess() {
    this.roleChangeModal.set({
      show: false,
      userId: '',
      newRole: '',
      isLoading: false
    });
    this.selectedDepartment = '';

    setTimeout(() => {
      this.filterState.next({...this.filterState.value});
    }, 0);
  }

  cancelRoleChange() {
    this.roleChangeModal.set({ show: false, userId: '', newRole: '' });
    this.selectedDepartment = '';
  }

  changeDepartment(userId: string, departmentId: string) {
    this.departmentService.changeDepartment({
      userId,
      departmentId
    }).subscribe({
      next: () => {
        this.filterState.next(this.filterState.value);
      },
      error: (error) => {
        console.error('Error changing department:', error);
        alert('Помилка при зміні відділу користувача');
      }
    });
  }

  onUserAdded() {
    this.filterState.next(this.filterState.value);
  }
}
