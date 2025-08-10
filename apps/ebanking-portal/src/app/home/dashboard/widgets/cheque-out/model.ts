export interface ChequeOutResponse {
  lastUpdatedTimestamp: number;
  deductedCheques: Cheque[];
  returnedCheques: Cheque[];
}

export interface Cheque {
  chequeSerialNumber: string;
  chequeValue: string;
  currency: string;
  debitAccountNumber: string;
  date: number;
}

export interface ChequesOutRes {
  lastUpdatedTimestamp: number; // it is in seconds
  totalPages: number;
  totalRecords: number;
  cheques: ChequesOutData[];
}

export interface ChequesOutData {
  settlementDate: number;
  serialNumber: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
  accountNumber: string;
  status: string;
}

export enum ChequesStatus {
  DEDUCTED = 'Deducted',
  RETURNED = 'Returned',
  OTHERS = 'Unknown',
}
export type ChequesOutStatus = 'Deducted' | 'Returned' | 'Unknown';

export const Tabs = [
  {
    name: 'deducted',
    id: 'deducted',
  },
  {
    name: 'returned',
    id: 'returned',
  },
];
