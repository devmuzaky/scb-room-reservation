export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface CurrencyAmount {
  currency: string;
  value: string | number;
}

export interface BaseResponse {
  status?: string;
  lastUpdatedTimestamp?: string;
}
