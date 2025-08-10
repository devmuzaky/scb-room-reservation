import { Beneficiary } from '@/home/beneficiary/models/models';

export interface ScheduledTransferDetailsRes {
  transferAmount: number;
  transferCurrency: string;
  fromAccount: FromAccount;
  toAccount: FromAccount;
  transferType: string;
  transferStatus: string;
  description: string;
  valueDate: string;
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
  errors: Error[];
  transferId: string;
  scheduleId: string;
  scheduleStats?: ScheduleStats;
  username: string;
  nextTransferDate: string;
}

interface ScheduleStats {
  numberOfSuccess: number;
  numberOfPending: number;
  numberOfFailed: number;
  total: number;
}

interface Error {
  field: string;
  code: string;
  message: string;
}

interface ScheduleDto {
  submitDate: string;
  endDate: string;
  numberOfTransfers: number;
  frequencyType: string;
}

interface ExchangeRate {
  currencyName: string;
  buy: number;
  sell: number;
}

interface FromAccount {
  accountNumber: string;
  accountNickname: string;
  accountType: string;
}
