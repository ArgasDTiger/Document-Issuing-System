export interface DocumentStatus {
  documentId: string;
  documentName: string;
  departmentName: string;
  requestDate: Date;
  expectedReceivingDate: Date;
  receivedDate?: Date;
  status: string;
}
