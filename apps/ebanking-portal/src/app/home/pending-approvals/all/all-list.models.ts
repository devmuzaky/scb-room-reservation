export interface AllDelegationList {
  accountNumber: string;
  productName: string;
  availableBalance: number;
  currency: string;
}

export interface AllListResponse {
  list: AllDelegationList[];
  lastUpdatedTimestamp: string;
  equivalentBalanceEGP: number;
  pagination: AllPagination;
}

export interface AllPagination {
  pageSize: number;
  pageStart: number;
  totalPages: number;
  totalSize: number;
}
