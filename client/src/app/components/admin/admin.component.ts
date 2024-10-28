import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from "../../services/user.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { User } from "../../models/user";
import {BehaviorSubject, debounceTime, distinctUntilChanged, forkJoin, switchMap} from "rxjs";
import {AddUserComponent} from "./add-user/add-user.component";
import {DepartmentService} from "../../services/department.service";
import {Department} from "../../models/department";
import {FormsModule} from "@angular/forms";

interface RoleChangeModal {
  show: boolean;
  userId: string;
  newRole: string;
  departments?: Department[];
  selectedDepartment?: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    AddUserComponent,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private userService = inject(UserService);
  private departmentService = inject(DepartmentService);

  departments = signal<Department[]>([]);
  hoveredUserId = signal<string | null>(null);

  roleChangeModal = signal<RoleChangeModal>({
    show: false,
    userId: '',
    newRole: '',
    departments: [],
    selectedDepartment: ''
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

  setHoveredUser(userId: string | null) {
    this.hoveredUserId.set(userId);
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

    const operations = [
      this.userService.changeUserRole(modal.userId, modal.newRole)
    ];

    if (modal.newRole === 'Employee' && this.selectedDepartment) {
      operations.push(
        this.departmentService.changeDepartment({
          userId: modal.userId,
          departmentId: this.selectedDepartment
        })
      );
    }

    forkJoin(operations).subscribe({
      next: () => {
        this.roleChangeModal.set({ show: false, userId: '', newRole: '' });
        this.selectedDepartment = '';
        this.filterState.next(this.filterState.value);
      },
      error: (error) => {
        console.error('Error changing user role or department:', error);
        alert('Помилка при зміні ролі або відділу користувача');
      }
    });
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
