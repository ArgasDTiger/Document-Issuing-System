import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Document } from '../../../models/document';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-document-card',
  standalone: true,
  imports: [DatePipe, NgIf],
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css'
})
export class DocumentCardComponent {
  @Input({ required: true }) document!: Document;
  @Input() userDocumentStatus: string = 'No operations';
  @Input() requestDate: Date | null = null;
  @Input() receivedDate: Date | null = null;
  @Output() requestDocument = new EventEmitter<string>();

  getStatusText(): string {
    switch (this.userDocumentStatus) {
      case 'No operations': return 'Доступний для запиту';
      case 'On process': return 'На опрацюванні';
      case 'Received': return 'Отримано';
      default: return this.userDocumentStatus;
    }
  }

  getExpectedDate(): Date {
    if (this.requestDate) {
      const date = new Date(this.requestDate);
      date.setDate(date.getDate() + 7);
      return date;
    }
    return new Date();
  }
}
