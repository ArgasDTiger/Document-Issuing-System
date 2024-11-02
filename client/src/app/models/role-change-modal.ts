import {Department} from "./department";

export interface RoleChangeModal {
  show: boolean;
  userId: string;
  newRole: string;
  departments?: Department[];
  selectedDepartment?: string;
  isLoading?: boolean;
}
