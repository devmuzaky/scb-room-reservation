export interface AllList {
  accountNumber: string;
  productName: string;
  availableBalance: number;
  currency: string;
  accountType: 'CD' | 'TD' | string;
}

export interface AllListResponse {
  accounts: AllList[];
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
