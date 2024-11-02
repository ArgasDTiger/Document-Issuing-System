export interface Document {
  id: string;
  name?: string;
  documentName?: string;
  type: string;
  requestDate: Date;
  expectedDate: Date;
  receivedDate: Date;
  userId: string;
  userLogin: string;
  status: string;
  departmentId: string;
  departmentName: string;
}
