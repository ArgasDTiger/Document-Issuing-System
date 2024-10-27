import {Injectable, signal} from "@angular/core";
import {Department} from "../models/department";
import {Document} from "../models/document";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {RequestDocument} from "../models/request-document";
import {CompleteDocument} from "../models/complete-document";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly baseUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.baseUrl);
  }

  requestDocument(login: string, documentId: string): Observable<any> {
    const request: RequestDocument = { login, documentId };
    return this.http.post(`${this.baseUrl}/request-document`, request);
  }

  deleteDocument(login: string, documentId: string): Observable<any> {
    const request: RequestDocument = { login, documentId };
    return this.http.delete(`${this.baseUrl}/delete-document`, { body: request });
  }

  completeDocument(login: string, documentId: string): Observable<any> {
    const request: CompleteDocument = { login, documentId };
    return this.http.post(`${this.baseUrl}/complete-document`, request);
  }
}
