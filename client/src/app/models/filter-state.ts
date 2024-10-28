import {PaginationParameters} from "./pagination-parameters";

export interface FilterState extends PaginationParameters {
  search: string;
  sortField: string;
}
