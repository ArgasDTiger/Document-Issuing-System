import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Department } from "../models/department";
import { environment } from "../../environments/environment";
import {User} from "../models/user";
import {AddDepartmentForm} from "../models/add-department-form";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly baseUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  changeDepartment(data: { userId: string; departmentId: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-department`, data);
  }

  addDepartment(departmentData: AddDepartmentForm): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/add-department`, departmentData);
  }
}
