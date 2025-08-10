import { AddBeneficiaryErrorResponse } from './models';

export const ALL_BENEFICIARY_TYPE = '';
export const INSIDE_SCB_BENEFICIARY_TYPE = 'INSIDE_SCB';
export const LOCAL_OUTSIDE_SCB_BENEFICIARY_TYPE = 'LOCAL_OUTSIDE_SCB';

export const BANK_ACCOUNT_PAYMENT_METHOD = 'BANK_ACCOUNT';
export const CARD_PAYMENT_METHOD = 'CARD';
export const WALLET_PAYMENT_METHOD = 'WALLET';
export const MOBILE_PAYMENT_METHOD = 'MOBILE_NUMBER';
export const PAYMENT_ADDRESS_PAYMENT_METHOD = 'PAYMENT_ADDRESS';
export const IBAN_PAYMENT_METHOD = 'IBAN';

export const ALL_PAYMENT_METHOD_INSIDE = `${BANK_ACCOUNT_PAYMENT_METHOD},${CARD_PAYMENT_METHOD},${WALLET_PAYMENT_METHOD},${MOBILE_PAYMENT_METHOD},${PAYMENT_ADDRESS_PAYMENT_METHOD}`;
export const ALL_PAYMENT_METHOD_OUTSIDE = `${BANK_ACCOUNT_PAYMENT_METHOD},${CARD_PAYMENT_METHOD},${WALLET_PAYMENT_METHOD},${MOBILE_PAYMENT_METHOD},${PAYMENT_ADDRESS_PAYMENT_METHOD},${IBAN_PAYMENT_METHOD}`;

export interface PaymentMethod {
  label: string;
  value: string;
  id: string;
  icon: string;
  formControlName: string;
  requiredFields: string[];
}

export const PAYMENT_METHODS_INSIDE: PaymentMethod[] = [
  {
    label: `transactionTypeOptions.${BANK_ACCOUNT_PAYMENT_METHOD}`,
    value: BANK_ACCOUNT_PAYMENT_METHOD,
    id: BANK_ACCOUNT_PAYMENT_METHOD,
    icon: 'bank',
    formControlName: 'paymentMethod',
    requiredFields: ['accountNumber', 'confirmAccountNumber'],
  },
  {
    label: `transactionTypeOptions.${CARD_PAYMENT_METHOD}`,
    value: CARD_PAYMENT_METHOD,
    id: CARD_PAYMENT_METHOD,
    icon: 'card',
    formControlName: 'paymentMethod',
    requiredFields: ['cardNumber', 'confirmCardNumber'],
  },
  {
    label: `transactionTypeOptions.${WALLET_PAYMENT_METHOD}`,
    value: WALLET_PAYMENT_METHOD,
    id: WALLET_PAYMENT_METHOD,
    icon: 'wallet',
    formControlName: 'paymentMethod',
    requiredFields: ['walletNumber', 'confirmWalletNumber'],
  },
  {
    label: `transactionTypeOptions.${MOBILE_PAYMENT_METHOD}`,
    value: MOBILE_PAYMENT_METHOD,
    id: MOBILE_PAYMENT_METHOD,
    icon: 'mobile',
    formControlName: 'paymentMethod',
    requiredFields: ['mobileNumber', 'confirmMobileNumber'],
  },
  {
    label: `transactionTypeOptions.${PAYMENT_ADDRESS_PAYMENT_METHOD}`,
    value: PAYMENT_ADDRESS_PAYMENT_METHOD,
    id: PAYMENT_ADDRESS_PAYMENT_METHOD,
    icon: 'payment-address',
    formControlName: 'paymentMethod',
    requiredFields: ['paymentAddress'],
  },
];

export const PAYMENT_METHODS_OUTSIDE: PaymentMethod[] = [
  {
    label: `transactionTypeOptions.${BANK_ACCOUNT_PAYMENT_METHOD}`,
    value: BANK_ACCOUNT_PAYMENT_METHOD,
    id: BANK_ACCOUNT_PAYMENT_METHOD,
    icon: 'bank',
    formControlName: 'paymentMethod',
    requiredFields: ['accountNumber', 'confirmAccountNumber', 'bank'],
  },
  {
    label: `transactionTypeOptions.${IBAN_PAYMENT_METHOD}`,
    value: IBAN_PAYMENT_METHOD,
    id: IBAN_PAYMENT_METHOD,
    icon: 'iban',
    formControlName: 'paymentMethod',
    requiredFields: ['iban', 'confirmIban'],
  },
  {
    label: `transactionTypeOptions.${CARD_PAYMENT_METHOD}`,
    value: CARD_PAYMENT_METHOD,
    id: CARD_PAYMENT_METHOD,
    icon: 'card',
    formControlName: 'paymentMethod',
    requiredFields: ['cardNumber', 'confirmCardNumber', 'bank'],
  },
  {
    label: `transactionTypeOptions.${WALLET_PAYMENT_METHOD}`,
    value: WALLET_PAYMENT_METHOD,
    id: WALLET_PAYMENT_METHOD,
    icon: 'wallet',
    formControlName: 'paymentMethod',
    requiredFields: ['walletNumber', 'confirmWalletNumber'],
  },
  {
    label: `transactionTypeOptions.${MOBILE_PAYMENT_METHOD}`,
    value: MOBILE_PAYMENT_METHOD,
    id: MOBILE_PAYMENT_METHOD,
    icon: 'mobile',
    formControlName: 'paymentMethod',
    requiredFields: ['mobileNumber', 'confirmMobileNumber'],
  },
  {
    label: `transactionTypeOptions.${PAYMENT_ADDRESS_PAYMENT_METHOD}`,
    value: PAYMENT_ADDRESS_PAYMENT_METHOD,
    id: PAYMENT_ADDRESS_PAYMENT_METHOD,
    icon: 'payment-address',
    formControlName: 'paymentMethod',
    requiredFields: ['paymentAddress'],
  },
];

export const BENEFICIARY_TRANSACTION_TYPE_OPTIONS = [
  // { key: '', value: `transactionTypeOptions.ALL`, checked: false },
  { key: BANK_ACCOUNT_PAYMENT_METHOD, value: `transactionTypeOptions.${BANK_ACCOUNT_PAYMENT_METHOD}`, checked: false },
  { key: IBAN_PAYMENT_METHOD, value: `transactionTypeOptions.${IBAN_PAYMENT_METHOD}`, checked: false },
  { key: CARD_PAYMENT_METHOD, value: `transactionTypeOptions.${CARD_PAYMENT_METHOD}`, checked: false },
  { key: WALLET_PAYMENT_METHOD, value: `transactionTypeOptions.${WALLET_PAYMENT_METHOD}`, checked: false },
  { key: MOBILE_PAYMENT_METHOD, value: `transactionTypeOptions.${MOBILE_PAYMENT_METHOD}`, checked: false },
  {
    key: PAYMENT_ADDRESS_PAYMENT_METHOD,
    value: `transactionTypeOptions.${PAYMENT_ADDRESS_PAYMENT_METHOD}`,
    checked: false,
  },
];

export const BENEFICIARY_TYPE_OPTIONS = [
  { key: ALL_BENEFICIARY_TYPE, value: `beneficiaryTypeOptions.ALL` },
  { key: INSIDE_SCB_BENEFICIARY_TYPE, value: `beneficiaryTypeOptions.${INSIDE_SCB_BENEFICIARY_TYPE}` },
  { key: LOCAL_OUTSIDE_SCB_BENEFICIARY_TYPE, value: `beneficiaryTypeOptions.${LOCAL_OUTSIDE_SCB_BENEFICIARY_TYPE}` },
];

export const BENEF_ERROR_CODES = {
  BENEFICIARY_NAME_TOO_LONG: 'BENEF-101',
  BENEFICIARY_NICKNAME_TOO_LONG: 'BENEF-102',
  BENEFICIARY_NICKNAME_EXISTS: 'BENEF-103',
  INVALID_TRANSACTION_METHOD: 'BENEF-104',
  INVALID_BENEFICIARY_NUMBER_ACCOUNT: 'BENEF-105',
  INVALID_BENEFICIARY_NUMBER_CARD: 'BENEF-106',
  INVALID_BENEFICIARY_NUMBER_MOBILE: 'BENEF-107',
  MISSING_FIELD: 'BENEF-108',
  INVALID_ACCOUNT_NUMBER: 'BENEF-109',
  INVALID_MOBILE_NUMBER: 'BENEF-110',
  INVALID_WALLET_NUMBER: 'BENEF-111',
  INVALID_CARD_NUMBER: 'BENEF-112',
  INVALID_PAYMENT_ADDRESS: 'BENEF-113',
  NO_BENEFICIARY_FOUND: 'BENEF-114',
  INVALID_BANK_NAME: 'BENEF-115',
  INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE: 'BENEF-116',
  INVALID_BENEFICIARY_NUMBER_IBAN: 'BENEF-117',
  INVALID_IBAN_PREFIX: 'BENEF-118',
  INVALID_IBAN_CODE: 'BENEF-119',
  INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE_DEFAULT: 'BENEF-120',
} satisfies Record<string, string>;

export const BENEFICIARY_NAME_TOO_LONG_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryName',
      code: BENEF_ERROR_CODES.BENEFICIARY_NAME_TOO_LONG,
      message: "Beneficiary name shouldn't exceed 50 characters",
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const BENEFICIARY_NICKNAME_TOO_LONG_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNickname',
      code: BENEF_ERROR_CODES.BENEFICIARY_NICKNAME_TOO_LONG,
      message: "Beneficiary nickname shouldn't exceed 50 characters",
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const BENEFICIARY_NICKNAME_EXISTS_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNickname',
      code: BENEF_ERROR_CODES.BENEFICIARY_NICKNAME_EXISTS,
      message: 'Nickname Already Exists, please choose a different one.',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_TRANSACTION_METHOD_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'transactionMethod',
      code: BENEF_ERROR_CODES.INVALID_TRANSACTION_METHOD,
      message: 'Invalid transaction method',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_BENEFICIARY_NUMBER_ACCOUNT_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_ACCOUNT,
      message: 'SCB account numbers are always 16 numeric digits.',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_BENEFICIARY_NUMBER_CARD_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_CARD,
      message: 'SCB card numbers is always 16 numeric digits.',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_BENEFICIARY_NUMBER_MOBILE_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_MOBILE,
      message: 'Mobile/wallet numbers is always 11 numeric digits.',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const MISSING_FIELD_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.MISSING_FIELD,
      message: 'This field is required. Please complete the information.',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_ACCOUNT_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_ACCOUNT_NUMBER,
      message: "Account number doesn't exist or inactive",
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_MOBILE_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_MOBILE_NUMBER,
      message: 'Mobile number is not linked to SCB account. Please verify and try again',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_WALLET_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_WALLET_NUMBER,
      message: 'wallet number is not linked to SCB account. Please verify and try again',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_CARD_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_CARD_NUMBER,
      message: "Card number doesn't exist or inactive",
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_PAYMENT_ADDRESS_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_PAYMENT_ADDRESS,
      message: "payment address doesn't exist or invalid",
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const NO_BENEFICIARY_FOUND_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryId',
      code: BENEF_ERROR_CODES.NO_BENEFICIARY_FOUND,
      message: 'No beneficiary found for this ID and username',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_BANK_NAME_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'bankName',
      code: BENEF_ERROR_CODES.INVALID_BANK_NAME,
      message: 'Invalid Bank Name',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE,
      message: 'Bank account numbers are always 19 digits and numeric.',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_BENEFICIARY_NUMBER_IBAN_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_IBAN,
      message: 'IBAN numbers are always 29 digits.',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_IBAN_PREFIX_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_IBAN_PREFIX,
      message: 'IBAN must start with EG',
    },
  ],
} satisfies AddBeneficiaryErrorResponse;

export const INVALID_IBAN_CODE_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: BENEF_ERROR_CODES.INVALID_IBAN_CODE,
      message: "IBAN doesn't exist or invalid",
    },
  ],
} satisfies AddBeneficiaryErrorResponse;
