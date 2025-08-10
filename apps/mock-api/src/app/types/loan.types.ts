import { BaseResponse, Pagination } from './common.types';

export interface LoanDetails {
  loanDescription: string;
  accountNumber: string;
  totalLoanAmount: number;
  tenor: string;
  paidAmount: number;
  remainingAmount: number;
  totalInstallments: number;
  totalPaidInstallments: number;
  remainingInstallments: number;
  installmentFrequency: string;
  maturityDate: string;
  interestRate: number;
  installmentAmount: number;
  installmentDate: string;
  currency: string;
}

export interface LoanResponse extends BaseResponse {
  loanDetails: LoanDetails;
}

export interface Loan {
  accountNumber: string;
  loanType: string;
  currency: string;
  totalAmount: number;
  remainingAmount: number;
  nextInstallmentDate: string;
  status: string;
}

export interface LoanListResponse extends BaseResponse {
  loans: Loan[];
  pagination: Pagination;
}
