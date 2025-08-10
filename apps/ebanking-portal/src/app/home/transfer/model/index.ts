export interface AccountDTO {
  nickname: string;
  accountType: string;
  accountNumber: string;
  availableBalance: number;
  currency: string;
  OVD?: boolean;
}

export interface PaginationDTO {
  totalSize: number;
  pageStart: number;
  pageSize: number;
  totalPages: number;
}

export interface AccountListResponseDTO {
  data: AccountDTO[];
  pagination: PaginationDTO;
}

export interface ReasonListResponse {
  data: {
    reasonAr: string;
    reasonEn: string;
  }[];
}

export interface TransferDataResponse {
  chargeBearer: {
    key: string;
    value: string;
  }[];
  frequencyType: {
    key: string;
    value: string;
  }[];
  transferType: {
    key: string;
    value: string;
  }[];
  transferNetwork: {
    key: string;
    value: string;
  }[];
}

export interface RecurringTransferRequestDTO {
  transferDate: string;
  frequency: string;
  numberOfTransfers: number;
  endDate: string;
}

export interface RecurringTransferResponseDTO {
  data: string[];
}

export interface TransferResponseDTO {
  transferAmount: number;
  transferCurrency: string;
  fromAccount: {
    accountNumber: string;
    accountNickname: string;
    accountType: string;
  };
  toAccount: {
    accountNumber: string;
    accountNickname: string;
    accountType: string;
  };
  transferType: TransferType;
  transferStatus: TransferStatus;
  description: string;
  valueDate: string;
  transactionDate: string;
  referenceId: string;
  convertedAmount: number;
  exchangeRate: {
    currencyName: string;
    buy: number;
    sell: number;
  };
  scheduleDto: {
    submitDate: string;
    frequencyType: string;
    endDate: string;
    numberOfTransfers: number;
  };
}

export interface TransferRequestDTO {
  transferType: TransferType;
  transferNetwork?: TransferNetwork;
  fromAccount: {
    accountNumber: string;
    accountNickname: string;
    accountType: string;
  };
  toAccount?: {
    accountNumber: string;
    accountNickname: string;
    accountType: string;
  };
  beneficiaryId: string;
  charityTransferDto?: CharityTransferDto;
  transferAmount: number;
  transferCurrency: string;
  chargeBearer: ChargeBearer;
  transferReason: string;
  description?: string;
  token: string;
  isSchedule: boolean;
  scheduleDto?: {
    submitDate: string;
    frequencyType: string;
    endDate: string;
    numberOfTransfers: number;
  };
  username: string;
  transferCategory?: TransferCategory;
  referenceId?: string;
  transactionDate?: string;
  valueDate?: string;

  fees?: number;
  feesCurrency?: string;
  exchangeRate?: number;
}

export interface TransferSaveRes {
  transferAmount: 0;
  transferCurrency: string;
  fromAccount: {
    accountNumber: string;
    accountNickname: string;
    accountType: string;
  };
  toAccount: {
    accountNumber: string;
    accountNickname: string;
    accountType: string;
  };
  charityTransferDto?: CharityTransferDto;
  transferType: TransferType;
  transferStatus: TransferStatus;
  description: string;
  valueDate: string;
  transactionDate: string;
  referenceId: string;
  convertedAmount: number;
  exchangeRate: {
    currencyName: string;
    buy: number;
    sell: number;
  };
  scheduleDto: {
    submitDate: string;
    frequencyType: string;
    endDate: string;
    numberOfTransfers: number;
  };
}

export interface TransferSaveError {
  errorId: string;
  code: string;
  message: string;
  errors: [
    {
      code: string;
      field: string;
      message: string;
    },
  ];
  details: string;
}

export interface ScheduledTransfer {
  scheduleId: string;
  beneficiaryName: string;
  transferAmount: number;
  transferCurrency: string;
  executionDate: string;
  nextExecutionDate: string | null;
  transferType: string;
  frequencyType: string;
  totalTransferCount: number;
  executedTransferCount: number;
}

export interface TransfersResponse {
  lastUpdatedTimestamp: string;
  transferList: ScheduledTransfer[];
  pagination: {
    pageStart: number;
    totalSize: number;
    pageSize: number;
    totalPages: number;
  };
}

export enum ScheduledTabsEnum {
  OT = 0,
  RT = 1,
}

export type TransferType = 'OWN' | 'INSIDE' | 'OUTSIDE' | 'CHARITY';
export type TransferStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REVERSED' | 'NOT_STARTED';
export type TransferNetwork = 'ACH' | 'IPN';
export type TransferCategory = 'INSTANT' | 'SCHEDULED' | 'RECURRING';
export type ChargeBearer = 'SENDER' | 'BENEFICIARY';

export type FrequencyType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY';

export const FREQUENCY_TYPE_OPTIONS = [
  { key: 'ONCE', value: 'frequencyTypeOptions.ONCE' },
  { key: 'DAILY', value: 'frequencyTypeOptions.DAILY' },
  { key: 'WEEKLY', value: 'frequencyTypeOptions.WEEKLY' },
  { key: 'MONTHLY', value: 'frequencyTypeOptions.MONTHLY' },
  { key: 'QUARTERLY', value: 'frequencyTypeOptions.QUARTERLY' },
  { key: 'SEMI_ANNUALLY', value: 'frequencyTypeOptions.SEMI_ANNUALLY' },
  // { key: 'YEARLY', value: 'frequencyTypeOptions.YEARLY' },
];

export const TRANSFER_TIMES_OPTIONS = [
  { key: 'numberOfTransfers', value: 'transfer.schedule.numberOfTransfers' },
  { key: 'endDate', value: 'transfer.schedule.endDate' },
];

export interface CharityListResponse {
  charityList: CharityItem[];
}

export interface CharityItem {
  customerId: string;
  customerNameEN: string;
  customerNameAR: string;
}

export interface CharityCategoriesResponse {
  accounts: CharityCategory[];
}

export interface CharityCategory {
  accountId: string;
  accountTitleEN: string;
  accountTitleAR: string;
}

export interface CharityTransferDto {
  accountNumber: string;
  charityName: string;
  charityType: string;
  customerId?: string;
}

export type TransferSteps = 'form' | 'summary' | 'otp' | 'success';

export interface SelectAccountFieldProps {
  type: 'from' | 'to';
  accountSelected: AccountDTO;
}
