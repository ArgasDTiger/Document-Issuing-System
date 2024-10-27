import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {DocumentService} from "../../../services/document.service";
import {Department} from "../../../models/department";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  private documentService = inject(DocumentService);

  @Input({ required: true }) set department(value: Department) {
    this.loadDocuments();
  }

  @Output() documentRequested = new EventEmitter<string>();

  documents = toSignal(this.documentService.getAllDocuments(), { initialValue: [] });

  private loadDocuments() {
  }

  onRequestDocument(documentId: string) {
    this.documentRequested.emit(documentId);
  }
}
