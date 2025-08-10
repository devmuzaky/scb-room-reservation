import { Pagination } from './dashboard';

export interface BeneficiaryAccount {
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryNickname: string;
  beneficiaryType: string;
  bankName: string | null;
  transactionMethod: string;
  beneficiaryNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum BeneficiaryType {
  INSIDE_SCB = 'INSIDE_SCB',
  LOCAL_OUTSIDE_SCB = 'LOCAL_OUTSIDE_SCB',
}

export enum TransactionMethod {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  IBAN = 'IBAN',
  CARD = 'CARD',
  WALLET = 'WALLET',
  MOBILE_NUMBER = 'MOBILE_NUMBER',
  PAYMENT_ADDRESS = 'PAYMENT_ADDRESS',
}

export interface AddBeneficiaryDTO {
  beneficiaryName: string;
  beneficiaryNickname: string;
  transactionMethod: TransactionMethod;
  beneficiaryNumber: string;
  username: string;
  bankName?: string;
}

export interface AddBeneficiaryResponse {
  status: 'error' | 'success';
  errors?: {
    field: string;
    code: string;
    message: string;
  }[];
  beneficiaryName?: string | null;
  bankName?: string | null;
}

export interface BeneficiaryListResponse {
  data: BeneficiaryAccount[];
  pagination: Pagination;
}

export interface BeneficiaryCreateRequest {
  name: string;
  nickname: string;
  type: BeneficiaryType;
  accountNumber?: string;
  cardNumber?: string;
  walletId?: string;
  mobileNumber?: string;
  paymentAddress?: string;
  bankName?: string;
  swiftCode?: string;
}

export interface BeneficiaryUpdateRequest {
  name?: string;
  nickname?: string;
  accountNumber?: string;
  cardNumber?: string;
  walletId?: string;
  mobileNumber?: string;
  paymentAddress?: string;
  bankName?: string;
  swiftCode?: string;
}
