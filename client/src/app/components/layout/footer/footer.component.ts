import { Component, OnInit } from '@angular/core';
import {Department} from "../../../models/department";
import {DepartmentService} from "../../../services/department.service";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  personalReferences: Department | undefined;
  financeDepartment: Department | undefined;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(departments => {
      this.personalReferences = departments.find(department => department.name === 'Відділ видачі довідок про місце проживання');
      this.financeDepartment = departments.find(department => department.name === 'Відділ видачі довідок про доходи');
    });
  }
}
