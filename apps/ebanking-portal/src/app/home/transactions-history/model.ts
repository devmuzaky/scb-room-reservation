import { Pagination } from '@/models/api';

export interface TransactionsResponse {
  lastUpdatedTimestamp: number | string;
  transferHistory: TransactionItem[];
  pagination: Pagination;
  status: string;
}

export interface TransactionItem {
  transferId: string;
  transactionDate: string;
  referenceNumber: string;
  debitedAccount: string;
  beneficiaryName: string;
  transferType: TransferTypeEnum;
  transferAmount: number;
  transferCurrency: string;
  transferStatus: TransferStatusEnum;
  isRecurring: boolean;
}

export enum TransferStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransferTypeEnum {
  OWN = 'OWN',
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE',
}

export interface TransferLookupData {
  chargeBearer: LookupItem[];
  transferStatus: LookupItem[];
  frequencyType: LookupItem[];
  transferType: LookupItem[];
  transferNetwork: LookupItem[];
}

export interface LookupItem {
  key: string;
  value: string;
}

export interface StatusOptions<T> {
  name: string;
  value: T;
}

export interface DateRangeOption {
  name: string;
  value: string;
}

export type TransactionsStatusTypes = 'SUCCESS' | 'PENDING' | 'FAILED';
export type TransactionsTransferTypes = 'OWN' | 'INSIDE' | 'OUTSIDE';
