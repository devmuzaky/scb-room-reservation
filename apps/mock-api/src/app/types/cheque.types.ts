import { BaseResponse, CurrencyAmount } from './common.types';

export interface Cheque {
  chequeSerial: string;
  chequeValue: string;
  draweeBank: string;
  payerName?: string;
  accountNumber?: string;
  currency: string;
  eventDate: string | number;
  status?: string;
}

export interface ChequeInResponse extends BaseResponse {
  collected: Cheque[];
  returned: Cheque[];
}

export interface ChequeOut {
  chequeSerial: string;
  beneficiaryName: string;
  amount: CurrencyAmount;
  status: string;
  issueDate: string;
  settlementDate: string;
}

export interface ChequeOutResponse extends BaseResponse {
  cheques: ChequeOut[];
}
