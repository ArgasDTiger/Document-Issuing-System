import {UserDocument} from "./user-document";

export interface User {
  login: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  roles: string;
  department: string;
  birthdate: Date;
  token: string;
  documents: UserDocument[];
}
