import {Document} from "./document";

export interface Department {
  id: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  documents: Document[];
}
