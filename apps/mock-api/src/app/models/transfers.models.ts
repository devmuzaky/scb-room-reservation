export interface AccountDTO {
  nickname: string;
  accountType: string;
  accountNumber: string;
  availableBalance: number;
  currency: string;
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
  transferStatus: {
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

export interface TransferHistoryItem {
  transferId: string;
  transactionDate: string;
  referenceNumber: string;
  debitedAccount: string;
  beneficiaryName: string;
  transferType: TransferType;
  transferAmount: number;
  transferCurrency: string;
  transferStatus: TransferStatus;
  isRecurring: boolean;
}

export interface TransferHistoryResponse {
  lastUpdatedTimestamp: string;
  transferHistory: TransferHistoryItem[];
  pagination: {
    pageStart: number;
    totalSize: number;
    pageSize: number;
    totalPages: number;
  };
  status: string;
}

export interface TransferHistoryQuery {
  transferType?: string;
  transferStatus?: string;
  fromDate?: string;
  toDate?: string;
  pageStart: number;
  pageSize: number;
  lang?: string;
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
  toAccount?: {
    accountNumber: string;
    accountNickname: string;
    accountType: string;
  };
  charityTransferDto?: {
    accountNumber: string;
    charityName: string;
    charityType: string;
  };
  transferType: TransferType;
  transferStatus: TransferStatus;
  beneficiary?: any;
  transferReason?: string;
  transferNetwork?: string;
  chargeBearer?: string;
  fees?: number;
  feesCurrency?: string;
  status: string;
  description?: string;
  valueDate: string;
  transactionDate: string;
  referenceId: string;
  convertedAmount: number;
  exchangeRate: {
    currencyName: string;
    buy: number;
    sell: number;
  };
  scheduleDto?: {
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
  charityTransferDto?: {
    accountNumber: string;
    charityName: string;
    charityType: string;
  };
  beneficiaryId?: string;
  transferAmount: number;
  transferCurrency: string;
  chargeBearer?: ChargeBearer;
  transferReason?: string;
  description?: string;
  token: string;
  isSchedule: boolean;
  scheduleDto?: {
    submitDate: string;
    frequencyType: string;
    endDate: string;
    numberOfTransfers: number;
  };
  username?: string;
  transferCategory?: TransferCategory;
  exchangeRate?: number;
}

export interface CharityDTO {
  customerId: string;
  customerNameEN: string;
  customerNameAR: string;
}

export interface CharityListResponseDTO {
  charityList: CharityDTO[];
}

export interface CharityCategoryDTO {
  accountId: string;
  accountTitleEN: string;
  accountTitleAR: string;
}

export interface CharityCategoriesResponseDTO {
  accounts: CharityCategoryDTO[];
}

export type TransferType = 'OWN' | 'INSIDE' | 'OUTSIDE' | 'CHARITY';
export type TransferStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REVERSED' | 'NOT_STARTED';
export type TransferNetwork = 'ACH' | 'IPN' | 'INTERNAL';
export type TransferCategory = 'INSTANT' | 'SCHEDULED' | 'RECURRING';
export type ChargeBearer = 'SENDER' | 'BENEFICIARY';
