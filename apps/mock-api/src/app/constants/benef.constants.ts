import { AddBeneficiaryResponse } from '../models/beneficiary';

export const BENEFICIARY_NAME_TOO_LONG = 'BENEF-101';
export const BENEFICIARY_NICKNAME_TOO_LONG = 'BENEF-102';
export const BENEFICIARY_NICKNAME_EXISTS = 'BENEF-103';
export const INVALID_TRANSACTION_METHOD = 'BENEF-104';
export const INVALID_BENEFICIARY_NUMBER_ACCOUNT = 'BENEF-105';
export const INVALID_BENEFICIARY_NUMBER_CARD = 'BENEF-106';
export const INVALID_BENEFICIARY_NUMBER_MOBILE = 'BENEF-107';
export const MISSING_FIELD = 'BENEF-108';
export const INVALID_ACCOUNT_NUMBER = 'BENEF-109';
export const INVALID_MOBILE_NUMBER = 'BENEF-110';
export const INVALID_WALLET_NUMBER = 'BENEF-111';
export const INVALID_CARD_NUMBER = 'BENEF-112';
export const INVALID_PAYMENT_ADDRESS = 'BENEF-113';
export const NO_BENEFICIARY_FOUND = 'BENEF-114';
export const INVALID_BANK_NAME = 'BENEF-115';
export const INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE = 'BENEF-116';
export const INVALID_BENEFICIARY_NUMBER_IBAN = 'BENEF-117';
export const INVALID_IBAN_PREFIX = 'BENEF-118';
export const INVALID_IBAN_CODE = 'BENEF-119';

export const BENEFICIARY_NAME_TOO_LONG_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryName',
      code: BENEFICIARY_NAME_TOO_LONG,
      message: "Beneficiary name shouldn't exceed 50 characters",
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const BENEFICIARY_NICKNAME_TOO_LONG_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNickname',
      code: BENEFICIARY_NICKNAME_TOO_LONG,
      message: "Beneficiary nickname shouldn't exceed 50 characters",
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const BENEFICIARY_NICKNAME_EXISTS_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNickname',
      code: BENEFICIARY_NICKNAME_EXISTS,
      message: 'Nickname Already Exists, please choose a different one.',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_TRANSACTION_METHOD_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'transactionMethod',
      code: INVALID_TRANSACTION_METHOD,
      message: 'Invalid transaction method',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_BENEFICIARY_NUMBER_ACCOUNT_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_BENEFICIARY_NUMBER_ACCOUNT,
      message: 'SCB account numbers are always 16 numeric digits.',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_BENEFICIARY_NUMBER_CARD_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_BENEFICIARY_NUMBER_CARD,
      message: 'SCB card numbers is always 16 numeric digits.',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_BENEFICIARY_NUMBER_MOBILE_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_BENEFICIARY_NUMBER_MOBILE,
      message: 'Mobile/wallet numbers is always 11 numeric digits.',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const MISSING_FIELD_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: MISSING_FIELD,
      message: 'This field is required. Please complete the information.',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_ACCOUNT_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_ACCOUNT_NUMBER,
      message: "Account number doesn't exist or inactive",
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_MOBILE_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_MOBILE_NUMBER,
      message: 'Mobile number is not linked to SCB account. Please verify and try again',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_WALLET_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_WALLET_NUMBER,
      message: 'wallet number is not linked to SCB account. Please verify and try again',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_CARD_NUMBER_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_CARD_NUMBER,
      message: "Card number doesn't exist or inactive",
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_PAYMENT_ADDRESS_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_PAYMENT_ADDRESS,
      message: "payment address doesn't exist or invalid",
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const NO_BENEFICIARY_FOUND_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryId',
      code: NO_BENEFICIARY_FOUND,
      message: 'No beneficiary found for this ID and username',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_BANK_NAME_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'bankName',
      code: INVALID_BANK_NAME,
      message: 'Invalid Bank Name',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE,
      message: 'Bank account numbers are always 19 digits and numeric.',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_BENEFICIARY_NUMBER_IBAN_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_BENEFICIARY_NUMBER_IBAN,
      message: 'IBAN numbers are always 29 digits.',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_IBAN_PREFIX_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_IBAN_PREFIX,
      message: 'IBAN must start with EG',
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const INVALID_IBAN_CODE_ERROR_RESPONSE = {
  status: 'error',
  errors: [
    {
      field: 'beneficiaryNumber',
      code: INVALID_IBAN_CODE,
      message: "IBAN doesn't exist or invalid",
    },
  ],
  beneficiaryName: null,
  bankName: null,
} satisfies AddBeneficiaryResponse;

export const BENEFICIARY_BANK_LIST = [
  {
    code: 'ABU_DHABI_COMMERCIAL_BANK',
    bankNameAr: 'بنك أبوظبي التجاري',
    bankNameEn: 'Abu Dhabi Commercial Bank',
    length: '16',
  },
  {
    code: 'ABU_DHABI_ISLAMIC_BANK_EGYPT',
    bankNameAr: 'مصرف أبوظبي الاسلامي',
    bankNameEn: 'Abu Dhabi Islamic Bank - Egypt',
    length: '12',
  },
  {
    code: 'AGRICULTURAL_EGYPTIAN_BANK',
    bankNameAr: 'البنك الزراعي المصري',
    bankNameEn: 'Agricultural Bank of Egypt',
    length: null,
  },
  {
    code: 'AL_AHLI_BANK_OF_KUWAIT',
    bankNameAr: 'البنك الأهلي الكويتي- مصر',
    bankNameEn: 'Al Ahli Bank of Kuwait - Egypt',
    length: null,
  },
  {
    code: 'BANK_ELBARKA_EGYPT',
    bankNameAr: 'بنك البركة مصر',
    bankNameEn: 'Al Baraka Bank Egypt',
    length: '13',
  },
  {
    code: 'ARAB_AFRICAN_INTERNATIONAL_BANK',
    bankNameAr: 'البنك العربي الافريقي الدولي',
    bankNameEn: 'Arab African International Bank',
    length: null,
  },
  {
    code: 'ARAB_BANK',
    bankNameAr: 'البنك العربي',
    bankNameEn: 'Arab Bank',
    length: null,
  },
  {
    code: 'ARAB_BANKING_CORPORATION_EGYPT',
    bankNameAr: 'بنك المؤسسة العربية المصرفية ABC',
    bankNameEn: 'Arab Banking Corporation',
    length: '16',
  },
  {
    code: 'ARAB_INTERNATIONAL_BANK',
    bankNameAr: 'المصرف العربي الدولي',
    bankNameEn: 'Arab International Bank',
    length: null,
  },
  {
    code: 'ATTIJARIWAFA_BANK_EGYPT',
    bankNameAr: 'بنك التجاري وفا',
    bankNameEn: 'Attijariwafa Bank',
    length: null,
  },
  {
    code: 'ARAB_INVESTMENT_BANK',
    bankNameAr: 'بنك نكست التجاري ش.م.م',
    bankNameEn: 'Bank NXT S.A.E',
    length: '16',
  },
  {
    code: 'BANK_OF_ALEXANDRIA',
    bankNameAr: 'بنك الاسكندرية',
    bankNameEn: 'Bank Of Alexandria',
    length: '12',
  },
  {
    code: 'BANQUE_DU_CAIRE',
    bankNameAr: 'بنك القاهرة',
    bankNameEn: 'Banque Du Caire',
    length: null,
  },
  {
    code: 'BANQUE_MISR',
    bankNameAr: 'بنك مصر',
    bankNameEn: 'Banque Misr',
    length: '16',
  },
  {
    code: 'BLOM_BANK_EGYPT',
    bankNameAr: 'بنك بلوم',
    bankNameEn: 'Blom Bank Egypt',
    length: '12',
  },
  {
    code: 'CENTRAL_BANK_OF_EGYPT',
    bankNameAr: 'البنك المركزي المصري',
    bankNameEn: 'Central Bank Of Egypt',
    length: null,
  },
  {
    code: 'CITIBANK',
    bankNameAr: 'سيتى بنك',
    bankNameEn: 'Citibank',
    length: null,
  },
  {
    code: 'COMMERCIAL_INTERNATIONAL_BANK',
    bankNameAr: 'البنك التجاري الدولي',
    bankNameEn: 'Commercial International Bank',
    length: null,
  },
  {
    code: 'CREDIT_AGRICOLE_EGYPT',
    bankNameAr: 'بنك كريدي أجريكول',
    bankNameEn: 'Credit Agricole Egypt',
    length: '14',
  },
  {
    code: 'EGYPTIAN_ARAB_LAND_BANK',
    bankNameAr: 'البنك العقاري المصري العربي',
    bankNameEn: 'Egyptian Arab Land Bank',
    length: null,
  },
  {
    code: 'EGYPTIAN_GULF_BANK',
    bankNameAr: 'البنك المصري الخليجي',
    bankNameEn: 'Egyptian Gulf Bank',
    length: '13',
  },
  {
    code: 'EMIRATES_NATIONAL_BANK_OF_DUBAI',
    bankNameAr: 'بنك الامارات دبي الوطني',
    bankNameEn: 'Emirates National Bank of Dubai',
    length: '13',
  },
  {
    code: 'EXPORT_DEVELOPMENT_BANK_OF_EGYPT',
    bankNameAr: 'البنك المصري لتنمية الصادرات',
    bankNameEn: 'Export Development Bank of Egypt',
    length: '16',
  },
  {
    code: 'FAISAL_ISLAMIC_BANK_OF_EGYPT',
    bankNameAr: 'بنك فيصل الاسلامي المصري',
    bankNameEn: 'Faisal Islamic Bank Of Egypt',
    length: '6',
  },
  {
    code: 'FAB_MISR',
    bankNameAr: 'بنك أبوظبي الأول- مصر',
    bankNameEn: 'First Abu Dhabi Bank Misr S.A.E.',
    length: null,
  },
  {
    code: 'HOUSING_AND_DEVELOPMENT_BANK',
    bankNameAr: 'بنك التعمير والاسكان',
    bankNameEn: 'Housing And Development Bank',
    length: null,
  },
  {
    code: 'HSBC_BANK_EGYPT',
    bankNameAr: 'بنك إتش إس بي سي',
    bankNameEn: 'HSBC',
    length: null,
  },
  {
    code: 'INDUSTRIAL_DEVELOPMENT_BANK',
    bankNameAr: 'بنك التنمية الصناعية',
    bankNameEn: 'Industrial Development Bank',
    length: '19',
  },
  {
    code: 'AHLI_UNITED_BANK',
    bankNameAr: 'بنك بيت التمويل الكويتي - مصر',
    bankNameEn: 'Kuwait Finance House Bank - Egypt',
    length: '13',
  },
  {
    code: 'MASHREQ_BANK',
    bankNameAr: 'بنك المشرق',
    bankNameEn: 'Mashreq Bank',
    length: '12',
  },
  {
    code: 'MID_BANK',
    bankNameAr: 'ميدبنك',
    bankNameEn: 'MIDBANK',
    length: null,
  },
  {
    code: 'NASSER_SOCIAL_BANK',
    bankNameAr: 'بنك ناصر الاجتماعي',
    bankNameEn: 'Nasser Social Bank',
    length: null,
  },
  {
    code: 'NATIONAL_BANK_OF_EGYPT',
    bankNameAr: 'البنك الأهلي المصري',
    bankNameEn: 'National Bank of Egypt',
    length: '19',
  },
  {
    code: 'NBG',
    bankNameAr: 'البنك الأهلي اليوناني',
    bankNameEn: 'National Bank of Greece',
    length: null,
  },
  {
    code: 'NATIONAL_BANK_OF_KUWAIT_EGYPT',
    bankNameAr: 'بنك الكويت الوطني- مصر',
    bankNameEn: 'National Bank Of Kuwait - Egypt',
    length: '16',
  },
  {
    code: 'NATIONAL_INVESTMENT_BANK',
    bankNameAr: 'بنك الاستثمار القومى',
    bankNameEn: 'National Investment Bank',
    length: null,
  },
  {
    code: 'QNB_ALAHLI',
    bankNameAr: 'بنك قطر الوطني الأهلي',
    bankNameEn: 'Qatar National Bank Alahli',
    length: '13',
  },
  {
    code: 'SOCIETE_ARAB_INTERNATIONAL_BANK',
    bankNameAr: 'بنك الشركة المصرفية العربية الدولية SAIB',
    bankNameEn: 'Societe Arabe Internationale De Ban',
    length: null,
  },
  {
    code: 'SUEZ_CANAL_BANK',
    bankNameAr: 'بنك قناة السويس',
    bankNameEn: 'Suez Canal Bank',
    length: null,
  },
  {
    code: 'THE_UNITED_BANK',
    bankNameAr: 'البنك المتحد',
    bankNameEn: 'The United Bank',
    length: '13',
  },
];
