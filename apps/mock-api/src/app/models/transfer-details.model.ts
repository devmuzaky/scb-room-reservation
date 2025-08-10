// models/transfer-details.model.ts

export interface TransferDetailsDTO {
  transferAmount: number;
  transferCurrency: string;
  fromAccount: AccountInfo;
  toAccount: AccountInfo;
  transferType: string;
  transferStatus: string;
  description: string;
  valueDate: string; // ISO string
  transactionDate: string;
  referenceId: string;
  convertedAmount: number;
  exchangeRate: ExchangeRate;
  beneficiary: Beneficiary;
  transferReason: string;
  transferNetwork: string;
  chargeBearer: string;
  fees: number;
  feesCurrency: string;
  scheduleDto: ScheduleDto;
  status: string;
  errors: TransferError[];
  transferId: string;
  scheduleId: string;
  scheduleStats: ScheduleStats;
  username: string;
  nextTransferDate: string;
  failureReason: string;
}

export interface AccountInfo {
  accountNumber: string;
  accountNickname: string;
  accountType: string;
}

export interface ExchangeRate {
  currencyName: string;
  buy: number;
  sell: number;
}

export interface Beneficiary {
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryNickname: string;
  beneficiaryType: string;
  bank: Bank;
  transactionMethod: string;
  beneficiaryNumber: string;
}

export interface Bank {
  code: string;
  bankNameAr: string;
  bankNameEn: string;
  length: string;
}

export interface ScheduleDto {
  submitDate: string;
  endDate: string;
  numberOfTransfers: number;
  frequencyType: string;
}

export interface TransferError {
  field: string;
  code: string;
  message: string;
}

export interface ScheduleStats {
  numberOfSuccess: number;
  numberOfPending: number;
  numberOfFailed: number;
  total: number;
}
