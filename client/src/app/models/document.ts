export interface Document {
  id: string;
  type: string;
  status: 'pending' | 'issued';
  requestDate: Date;
  expectedDate: Date;
  userId: string;
}
