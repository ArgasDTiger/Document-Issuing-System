import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Department } from "../models/department";
import { environment } from "../../environments/environment";

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
}
