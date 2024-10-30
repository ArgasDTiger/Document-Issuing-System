import {Department} from "./department";
import {DocumentStatus} from "./document-status";

export interface User {
  id: string;
  login: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
  birthdate: Date;
  department?: Department;
  documents: DocumentStatus[];
  token?: string;
}
