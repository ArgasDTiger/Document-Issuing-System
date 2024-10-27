export interface User {
  login: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: 'user' | 'employee' | 'admin';
  department?: string;
  birthdate: Date;
  token: string;
}
