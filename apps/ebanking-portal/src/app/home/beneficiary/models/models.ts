export interface Beneficiary {
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryNickname: string;
  beneficiaryNumber: string;
  beneficiaryType: BeneficiaryType;
  transactionMethod: TransactionMethod;
  bank?: BankOfBeneficiary | null;
  icon?: string | null;
}

export type BeneficiaryType = 'INSIDE_SCB' | 'LOCAL_OUTSIDE_SCB' | 'ALL';
export type TransactionMethod = 'BANK_ACCOUNT' | 'IBAN' | 'CARD' | 'WALLET' | 'MOBILE_NUMBER' | 'PAYMENT_ADDRESS';

export interface AddBeneficiaryFormData {
  beneficiaryName: string;
  beneficiaryNickname: string;
  transactionMethod: TransactionMethod;
  beneficiaryNumber: string;
  isActive: boolean;
  bankName?: string;
}

export interface AddBeneficiaryErrorResponse {
  status: 'error' | 'success';
  errors?: {
    field: string;
    code: string;
    message: string;
  }[];
}

export interface AddBeneficiaryResponse extends AddBeneficiaryErrorResponse, BeneficiaryResponse {}

export interface BeneficiaryResponse {
  beneficiaryName?: string | null;
  bankName?: string | null;
  beneficiaryId: string;
  beneficiaryNickname: string;
  beneficiaryType: BeneficiaryType;
  bank: BankOfBeneficiary;
  transactionMethod: TransactionMethod;
  beneficiaryNumber: string;
}

export interface BankOfBeneficiary {
  code: string;
  bankNameAr: string;
  bankNameEn: string;
  length: string | null;
}
