import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private departmentDocuments = {
    hr: ['Довідка про місце проживання', 'Ще якась довідка'],
    finance: ['Довідка про доходи']
  };

  getDocumentsByDepartment(department: string): string[] {
    return this.departmentDocuments[department] || [];
  }
}
