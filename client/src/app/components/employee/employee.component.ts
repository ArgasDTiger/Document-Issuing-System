import { Component } from '@angular/core';
import {DocumentService} from "../../services/document.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  documents = this.documentService.getDocumentsByDepartment('hr');

  constructor(private documentService: DocumentService) {}
}
