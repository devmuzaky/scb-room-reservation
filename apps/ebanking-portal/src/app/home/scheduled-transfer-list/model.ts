import { Pagination } from '@/models/api';

export enum TransferTypeEnum {
  OWN = 'OWN',
  INSIDE = 'INSIDE',
  OUTSIDE = 'OUTSIDE',
}

export interface LookupItem {
  key: string;
  value: string;
}

export type TransactionsStatusTypes = 'SUCCESS' | 'PENDING' | 'FAILED';
export type TransferTypes = 'OWN' | 'INSIDE' | 'OUTSIDE';
