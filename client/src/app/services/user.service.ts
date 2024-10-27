import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import {AddUserForm} from "../models/add-user-form";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(sortField?: string, sortDirection?: string, searchString?: string): Observable<User[]> {
    let params: any = {};
    if (sortField) params.sortField = sortField;
    if (sortDirection) params.sortDirection = sortDirection;
    if (searchString) params.searchString = searchString;

    return this.http.get<User[]>(this.baseUrl, { params });
  }

  addUser(userData: AddUserForm): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/add-user`, userData);
  }

  changeUserRole(userId: string, newRole: User['role']): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-role`, null, {
      params: { userId, newRole }
    });
  }
}
