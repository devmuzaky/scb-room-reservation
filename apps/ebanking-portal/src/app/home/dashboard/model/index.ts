import { CURRENCY_FLAG } from './constants';

export interface DashboardResponse {
  accountsOverView: AccountsOverView;
}

export interface AccountsOverView {
  lastUpdateAt: number;
  accounts: Accounts;
  deposits: Deposits;
  certificates: Certificates;
}

export interface Accounts {
  equivalentInEGP: number;
  accountsList: Account[];
}

export interface Account {
  currency: keyof typeof CURRENCY_FLAG;
  totalAmount: number;
  equivalentInEGP: number;
  totalAccounts: number;
}

export interface Deposits {
  equivalentInEGP: number;
  depositsList: Deposit[];
}

export interface Deposit {
  currency: keyof typeof CURRENCY_FLAG;
  totalAmount: number;
  equivalentInEGP: number;
  timeDepositsCount: number;
}

export interface Certificates {
  equivalentInEGP: number;
  certificatesList: Certificate[];
}

export interface Certificate {
  currency: keyof typeof CURRENCY_FLAG;
  totalAmount: number;
  equivalentInEGP: number;
  certificatesCount: number;
}

export interface Loan {
  loanId: string;
  loanType: string;
  totalPaidAmount: number;
  totalRemainingAmount: number;
  totalLoanAmount: number;
  currency: keyof typeof CURRENCY_FLAG;
  categoryId: string;
}

export interface LoanApiResponse {
  loans: Loan[];
}
