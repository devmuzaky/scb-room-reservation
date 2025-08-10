import { Pagination } from '@/core/models/api';

export interface AccountDetails {
  nickname: string;
  totalAvailableBalance: number;
  accountType: string;
  accountNumber: number;
  iban: string;
  totalBalance: number;
  availableBalance: number;
  pendingBalance: number;
  blockedBalance: number;
  lastUpdated?: number;
  currency: string;
}

export interface AccountTransaction {
  accountId: number;
  transactionDate: string; // Consider using Date if you plan to parse it
  transactionType: string;
  description: string | null;
  detailedDescription: string;
  debitAmount: number;
  creditAmount: number;
  status: string;
  currencyId: string;
  balanceAfter: number;
}

export interface AccountTransactionResponse {
  transactions: AccountTransaction[];
  pagination: Pagination;
}

export interface searchPayloadRequest {
  accountId: string;
  transactionType: string;
  status: string;
  pageSize: string;
  pageNo: string;
}

export const TRANSACTION_TYPE_OPTIONS = ['TRANSFER', 'WITHDRAWAL', 'DEPOSIT', 'CHEQUE', 'UNKNOWN'];
export const STATUS_OPTIONS = ['COMPLETED', 'PENDING'];
