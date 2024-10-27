import {Document} from "./document";
import {UserDocument} from "./user-document";

export interface User {
  login: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: 'user' | 'employee' | 'admin';
  birthdate: Date;
  token: string;
  documents: UserDocument[];
}
