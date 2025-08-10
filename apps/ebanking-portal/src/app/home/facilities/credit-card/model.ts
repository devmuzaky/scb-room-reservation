import { Pagination } from '@/models/api';

export interface CreditCardRes {
  ccList: CreditCardData[];
  pagination: Pagination;
}

export interface CreditCardData {
  ccNumber: string;
  holderName: string;
  availableToUse: number;
  utilizedAmount: number;
  dueAmount: number;
  dueDate: string;
  currency: string;
  creditCardNumber: string;
}

export interface TransactionsRes {
  transactions: TransactionList[];
  pagination: Pagination;
}

export interface TransactionList {
  accountId: number;
  transactionDate: string;
  transactionType: string;
  transactionCategory: string;
  transactionCode: string;
  description: string;
  referenceNumber: string;
  debitAmount: number;
  creditAmount: number;
  status: string;
  currencyId: string;
  balanceAfter: number;
}

export type TransactionStatus = 'settled' | 'pending';

export interface CreditCardDetails {
  cardLimit: number;
  availableBalance: number;
  utilizedAmount: number;
  heldAmount: number;
  dueAmount: number;
  dueDate: string;
  currency: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  companyName: string;
  lastUpdated: string;
}
