import {UserDocument} from "./user-document";
import {Department} from "./department";

export interface User {
  id: string;
  login: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: string;
  department?: Department;
  departmentId?: string;
  birthdate: Date;
  token: string;
  documents: UserDocument[];
}
