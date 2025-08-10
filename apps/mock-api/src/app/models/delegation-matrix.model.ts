export interface AllDelegation {
  id: number;
  requestDate: string;
  requestType: string;
  requestNumber: number;
  amount: string;
  status: string;
  currency: string;
}

export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface DelegationResponse {
  pagination: Pagination;
  list: AllDelegation[];
}

export interface DelegationQuery {
  pageStart: number;
  pageSize: number;
  status?: string[];
}
