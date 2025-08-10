import { CharityTransferDto } from '@/home/transfer/model';

export interface TransferDetailsDTO {
  transferAmount: number;
  transferCurrency: string;
  fromAccount: AccountInfo;
  toAccount: AccountInfo;
  transferType: string | undefined;
  transferStatus: string;
  description: string;
  valueDate: string;
  transactionDate: string;
  referenceId: string;
  convertedAmount: number;
  exchangeRate: ExchangeRate;
  beneficiary: BeneficiaryDetails;
  transferReason: string;
  transferNetwork: string;
  chargeBearer: string;
  fees: number;
  feesCurrency: string;
  scheduleDto: ScheduleDto;
  status: string;
  errors: TransferError;
  transferId: string;
  scheduleId: string;
  scheduleStats: ScheduleStats;
  username: string;
  nextTransferDate: string;
  failureReason: string;
  achTransactionId: string;
  charityTransferDto?: CharityTransferDto;
}

export interface AccountInfo {
  accountNumber: string;
  accountNickname: string;
  accountType: string;
  availableBalance: number;
}

export interface ExchangeRate {
  currencyName: string;
  buy: number;
  sell: number;
}

export interface BeneficiaryDetails {
  beneficiaryId: string | undefined;
  beneficiaryName: string;
  beneficiaryNickname: string;
  beneficiaryType: string;
  bank: Bank;
  transactionMethod: string;
  beneficiaryNumber: string;
  icon?: string | null;
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
  errorId: string;
  code: string;
  message: string;
}

export interface ScheduleStats {
  numberOfSuccess: number;
  numberOfPending: number;
  numberOfFailed: number;
  total: number;
}
