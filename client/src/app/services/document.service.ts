import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {RequestDocument} from "../models/request-document";
import {CompleteDocument} from "../models/complete-document";
import {Document} from "../models/document";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly baseUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.baseUrl);
  }

  getMyDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/my-documents`).pipe(
      tap(docs => {
        docs.forEach(doc => console.log('Document name:', doc.documentName));
      }),
      map(docs => docs.map(doc => ({
        ...doc,
        status: doc.status || 'No operations',
        requestDate: doc.requestDate ? new Date(doc.requestDate) : null,
        receivedDate: doc.receivedDate ? new Date(doc.receivedDate) : null
      })))
    );
  }

  requestDocument(login: string, documentId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-document`, { userLogin: login, documentId });
  }

  getDocumentsByDepartment(departmentId: string): Observable<Document[]> {
    return this.getAllDocuments().pipe(
      map(documents => documents.filter(doc => doc.departmentId === departmentId))
    );
  }

  deleteDocument(login: string, documentId: string) {
    const request: RequestDocument = { userLogin: login, documentId };
    return this.http.delete(`${this.baseUrl}/delete-document`, { body: request });
  }

  completeDocument(login: string, documentId: string): Observable<any> {
    const request: CompleteDocument = { userLogin: login, documentId };
    return this.http.post(`${this.baseUrl}/complete-document`, request);
  }
}
