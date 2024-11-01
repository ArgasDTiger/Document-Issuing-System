import {Department} from "./department";
import {Document} from "./document";

export interface User {
  id: string;
  login: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
  dateOfBirth: Date;
  department?: Department;
  documents: Document[];
  token?: string;
}
