export interface UserDocument {
  documentId: string;
  documentName: string;
  departmentName: string;
  requestDate: Date;
  expectedReceivingDate: Date;
  receivedDate: Date;
  status: string;
}
