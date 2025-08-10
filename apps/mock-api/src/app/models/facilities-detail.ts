export interface LoanRepayment {
  installmentDate: string;
  installmentAmount: number;
  status: string;
  currency: string;
}

export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface LoanRepaymentResponse {
  pagination: Pagination;
  loansList: LoanRepayment[];
}
