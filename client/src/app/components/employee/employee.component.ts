import { Component, computed, effect, inject, signal } from '@angular/core';
import { DocumentService } from "../../services/document.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import {UserService} from "../../services/user.service";
import {BehaviorSubject, switchMap} from "rxjs";
import {User} from "../../models/user";

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

  private sortSubject = new BehaviorSubject<string>('');

  private users = toSignal(
    this.sortSubject.pipe(
      switchMap(sortField =>
        this.userService.getAllUsers(sortField)
      )
    ),
    { initialValue: [] as User[] }
  );

  activeDocuments = computed(() => {
    const users = this.users();
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

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortSubject.next(select.value);
  }

  completeDocument(userLogin: string, documentId: string) {
    this.documentService.completeDocument(userLogin, documentId)
      .subscribe({
        next: () => {
          this.sortSubject.next(this.sortSubject.value);
        },
        error: (error) => {
          console.error('Error completing document:', error);
          alert('Помилка при оновленні статусу документа');
        }
      });
  }
}
