import { Pagination } from '@/models/api';

export interface ChequeInResponse {
  lastUpdatedTimestamp: number | string;
  collected?: ChequeIn[];
  returned?: ChequeIn[];
  postDated?: ChequeIn[];
  unknown?: ChequeIn[];
  pagination: Pagination;
}

export interface ChequeIn {
  chequeSerial: string;
  chequeValue: string;
  currency: string;
  payerName: string;
  accountNumber: string;
  draweeBank: string;
  eventDate: string;
  // we have to manually add it based on the collection
  status?: string;
}

export const Tabs = [
  {
    name: 'collected',
    id: 'collected',
  },
  {
    name: 'returned',
    id: 'returned',
  },
  {
    name: 'postDated',
    id: 'postDated',
  },
];

export enum ChequesTypes {
  COLLECTED = 'collected',
  RETURNED = 'returned',
  DEDUCTED = 'deducted',
  POSTDATED = 'postdated',
  OTHERS = 'others',
}

export type ChequesInTypes = 'collected' | 'returned' | 'postdated' | 'unknown';

export interface Bank {
  name: string;
  code: string;
}
