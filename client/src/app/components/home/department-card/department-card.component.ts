import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Department} from "../../../models/department";

@Component({
  selector: 'app-department-card',
  standalone: true,
  imports: [],
  templateUrl: './department-card.component.html',
  styleUrl: './department-card.component.css'
})
export class DepartmentCardComponent {
  @Input({ required: true }) department!: Department;
  @Output() selected = new EventEmitter<Department>();
}
