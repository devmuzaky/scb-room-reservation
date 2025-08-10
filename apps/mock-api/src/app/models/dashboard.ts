import { AccountOverviewResponse, AccountTransactionResponse } from '../types/dashboard.types';

export const ACCOUNT_OVERVIEW_RESPONSE_MOCK: AccountOverviewResponse = {
  accountsOverView: {
    lastUpdateAt: '2025-02-10T11:53:00Z',
    accounts: {
      equivalentInEGP: '5555555555',
      accountsList: [
        { currency: 'EGP', totalAmount: 5555, equivalentInEGP: 6555, totalAccounts: 4 },
        { currency: 'USD', totalAmount: 1234, equivalentInEGP: 4567, totalAccounts: 6 },
        { currency: 'EUR', totalAmount: 2345, equivalentInEGP: 6789, totalAccounts: 7 },
        { currency: 'GBP', totalAmount: 3456, equivalentInEGP: 7890, totalAccounts: 9 },
        { currency: 'JPY', totalAmount: 4567, equivalentInEGP: 8901, totalAccounts: 10 },
        { currency: 'AUD', totalAmount: 5678, equivalentInEGP: 9012, totalAccounts: 2 },
      ],
    },
    deposits: {
      equivalentInEGP: 8888,
      depositsList: [
        { currency: 'USD', totalAmount: '88888', equivalentInEGP: 999, timeDepositsCount: 2 },
        { currency: 'EGP', totalAmount: '99999', equivalentInEGP: 555, timeDepositsCount: 3 },
        { currency: 'EUR', totalAmount: '55555', equivalentInEGP: 444, timeDepositsCount: 6 },
        { currency: 'GBP', totalAmount: '33333', equivalentInEGP: 333, timeDepositsCount: 1 },
        { currency: 'JPY', totalAmount: '22222', equivalentInEGP: 222, timeDepositsCount: 6 },
        { currency: 'AUD', totalAmount: '11111', equivalentInEGP: 111, timeDepositsCount: 8 },
      ],
    },
    certificates: {
      equivalentInEGP: 8888888888,
      certificatesList: [
        { currency: 'USD', totalAmount: 88, equivalentInEGP: 66, certificatesCount: 5 },
        { currency: 'EGP', totalAmount: 99, equivalentInEGP: 77, certificatesCount: 6 },
        { currency: 'EUR', totalAmount: 77, equivalentInEGP: 55, certificatesCount: 4 },
        { currency: 'GBP', totalAmount: 66, equivalentInEGP: 44, certificatesCount: 2 },
        { currency: 'JPY', totalAmount: 55, equivalentInEGP: 33, certificatesCount: 3 },
        { currency: 'AUD', totalAmount: 44, equivalentInEGP: 22, certificatesCount: 1 },
      ],
    },
  },
};

export const PENDING_APPROVALS = {
  status: 'SUCCESS',
  lastUpdatedTimestamp: '2025-02-23T18:00:00Z',
  groups: [
    {
      groupId: 'TRANSFERS',
      groupName: 'TRANSFERS',
      groupDescription: 'Own account transfers, SCB transfers, local transfers, add beneficiary',
      transactions: [
        {
          transactionId: 'TXN-1000002',
          transactionType: 'SCB_TRANSFER',
          submittedBy: 'user.maker2',
          submittedAt: '2025-02-23T15:20:00Z',
          amount: {
            currency: 'USD',
            value: '1000.00',
          },
          status: 'PENDING_APPROVAL',
        },
        {
          transactionId: 'TXN-1000001',
          transactionType: 'OWN_ACCOUNT_TRANSFER',
          submittedBy: 'user.maker1',
          submittedAt: '2025-02-23T14:15:00Z',
          amount: {
            currency: 'EGP',
            value: '5000.00',
          },
          status: 'PENDING_APPROVAL',
        },
      ],
    },
    {
      groupId: 'PAYMENTS',
      groupName: 'PAYMENTS',
      groupDescription: 'Gov. payments, charity payments',
      transactions: [
        {
          transactionId: 'TXN-2000001',
          transactionType: 'GOV_PAYMENT',
          submittedBy: 'user.maker1',
          submittedAt: '2025-02-22T13:30:00Z',
          amount: {
            currency: 'EGP',
            value: '2500.00',
          },
          status: 'PENDING_APPROVAL',
        },
      ],
    },
    {
      groupId: 'REQUESTS',
      groupName: 'REQUESTS',
      groupDescription: 'New account opening, Chequebook request, ...',
      transactions: [
        {
          transactionId: 'REQ-3000001',
          transactionType: 'NEW_ACCOUNT_OPENING',
          submittedBy: 'user.maker3',
          submittedAt: '2025-02-21T10:00:00Z',
          status: 'PENDING_APPROVAL',
        },
      ],
    },
  ],
};

export const CHEQUES_IN = {
  lastUpdatedTimestamp: 1740388890531,
  collected: [
    {
      chequeSerial: 'CHQ-16000006924',
      chequeValue: '1000000.00',
      draweeBank: 'Cairo Bank',
      payerName: 'Cairo Bank',
      accountNumber: '9998123123',
      currency: 'EGP',
      eventDate: '2025-03-20T08:35:00Z',
      status: 'POSTDATED',
    },
    {
      chequeSerial: 'CHQ-16000006924',
      chequeValue: '950345.67',
      draweeBank: 'Cairo Bank',
      payerName: 'Cairo Bank',
      accountNumber: '9998123123',
      currency: 'EGP',
      eventDate: '2025-03-20T08:35:00Z',
      status: 'POSTDATED',
    },
    {
      chequeSerial: 'CHQ-16000006925',
      chequeValue: '1123456.78',
      draweeBank: 'Cairo Bank',
      payerName: 'Cairo Bank',
      accountNumber: '9998123123',
      currency: 'EGP',
      eventDate: '2025-03-20T08:35:00Z',
      status: 'POSTDATED',
    },
    {
      chequeSerial: 'CHQ-16000006926',
      chequeValue: '876543.21',
      draweeBank: 'Cairo Bank',
      payerName: 'Cairo Bank',
      accountNumber: '9998123123',
      currency: 'EGP',
      eventDate: '2025-03-20T08:35:00Z',
      status: 'POSTDATED',
    },
  ],
  returned: [
    {
      chequeSerial: 'CHQ-16000006924',
      chequeValue: '1000000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740388890531,
    },
    {
      chequeSerial: 'CHQ-16000006927',
      chequeValue: '1054321.98',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740414810000,
    },
    {
      chequeSerial: 'CHQ-16000006928',
      chequeValue: '987654.32',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740423450000,
    },
    {
      chequeSerial: 'CHQ-16000006929',
      chequeValue: '1012345.67',
      draweeBank: '1630003810100106',
      currency: 'EGP',
      eventDate: 1740432090000,
    },
    {
      chequeSerial: 'CHQ-16000006930',
      chequeValue: '999999.99',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740440730000,
    },
    {
      chequeSerial: 'CHQ-16000006931',
      chequeValue: '1000000.01',
      draweeBank: '1630003810100108',
      currency: 'EGP',
      eventDate: 1740449370000,
    },
    {
      chequeSerial: 'CHQ-16000006932',
      chequeValue: '1150000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740458010000,
    },
    {
      chequeSerial: 'CHQ-16000006933',
      chequeValue: '850000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740466650000,
    },
  ],
  postDated: [
    {
      chequeSerial: 'CHQ-16000006924',
      chequeValue: '1000000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740388890531,
    },
    {
      chequeSerial: 'CHQ-16000006927',
      chequeValue: '1054321.98',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740414810000,
    },
    {
      chequeSerial: 'CHQ-16000006928',
      chequeValue: '987654.32',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740423450000,
    },
    {
      chequeSerial: 'CHQ-16000006929',
      chequeValue: '1012345.67',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740432090000,
    },
    {
      chequeSerial: 'CHQ-16000006930',
      chequeValue: '999999.99',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740440730000,
    },
    {
      chequeSerial: 'CHQ-16000006931',
      chequeValue: '1000000.01',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740449370000,
    },
    {
      chequeSerial: 'CHQ-16000006932',
      chequeValue: '1150000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740458010000,
    },
    {
      chequeSerial: 'CHQ-16000006933',
      chequeValue: '850000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740466650000,
    },
  ],
  unknown: [
    {
      chequeSerial: 'CHQ-16000006930',
      chequeValue: '999999.99',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740440730000,
    },
    {
      chequeSerial: 'CHQ-16000006931',
      chequeValue: '1000000.01',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740449370000,
    },
    {
      chequeSerial: 'CHQ-16000006932',
      chequeValue: '1150000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740458010000,
    },
    {
      chequeSerial: 'CHQ-16000006933',
      chequeValue: '850000.00',
      draweeBank: 'Cairo Bank',
      currency: 'EGP',
      eventDate: 1740466650000,
    },
  ],
  status: 'SUCCESS',
  pagination: {
    pageStart: 0,
    pageSize: 10,
    totalPages: 2,
    totalSize: 13,
  },
};

export const CHEQUES_OUT = {
  lastUpdatedTimestamp: 1740388890531,
  deductedCheques: [
    {
      chequeSerialNumber: '16000006924',
      chequeValue: '1000000.00',
      debitAccountNumber: '1630003810100101',
      currency: 'EGP',
      date: 1740388890531,
    },
    {
      chequeSerialNumber: '16000006924',
      chequeValue: '950345.67',
      debitAccountNumber: '1630003810100101',
      currency: 'EGP',
      date: 1740388890531,
    },
    {
      chequeSerialNumber: '16000006925',
      chequeValue: '1123456.78',
      debitAccountNumber: '1630003810100102',
      currency: 'EGP',
      date: 1740397530000,
    },
    {
      chequeSerialNumber: '16000006926',
      chequeValue: '876543.21',
      debitAccountNumber: '1630003810100103',
      currency: 'EGP',
      date: 1740406170000,
    },
  ],
  returnedCheques: [
    {
      chequeSerialNumber: '16000006924',
      chequeValue: '1000000.00',
      debitAccountNumber: '1630003810100101',
      currency: 'EGP',
      date: 1740388890531,
    },
    {
      chequeSerialNumber: '16000006927',
      chequeValue: '1054321.98',
      debitAccountNumber: '1630003810100104',
      currency: 'EGP',
      date: 1740414810000,
    },
    {
      chequeSerialNumber: '16000006928',
      chequeValue: '987654.32',
      debitAccountNumber: '1630003810100105',
      currency: 'EGP',
      date: 1740423450000,
    },
    {
      chequeSerialNumber: '16000006929',
      chequeValue: '1012345.67',
      debitAccountNumber: '1630003810100106',
      currency: 'EGP',
      date: 1740432090000,
    },
    {
      chequeSerialNumber: '16000006930',
      chequeValue: '999999.99',
      debitAccountNumber: '1630003810100107',
      currency: 'EGP',
      date: 1740440730000,
    },
    {
      chequeSerialNumber: '16000006931',
      chequeValue: '1000000.01',
      debitAccountNumber: '1630003810100108',
      currency: 'EGP',
      date: 1740449370000,
    },
    {
      chequeSerialNumber: '16000006932',
      chequeValue: '1150000.00',
      debitAccountNumber: '1630003810100109',
      currency: 'EGP',
      date: 1740458010000,
    },
    {
      chequeSerialNumber: '16000006933',
      chequeValue: '850000.00',
      debitAccountNumber: '1630003810100110',
      currency: 'EGP',
      date: 1740466650000,
    },
  ],
};

export const EXCHANGE_RATE = {
  rates: [
    {
      currencyName: 'USD',
      buy: 0.0202716399756,
      sell: 0.0202306291725,
      trend: 'up',
    },
    {
      currencyName: 'EUR',
      buy: 0.0185739652443,
      sell: 0.0184906455823,
      trend: 'up',
    },
    {
      currencyName: 'AED',
      buy: 0.0745795577432,
      sell: 0.0743091110401,
      trend: 'up',
    },
    {
      currencyName: 'SAR',
      buy: 0.0764076193678,
      sell: 0.0758990239385,
      trend: 'up',
    },
    {
      currencyName: 'GBP',
      buy: 0.0158831256085,
      sell: 0.0157891329713,
      trend: 'up',
    },
    {
      currencyName: 'CHF',
      buy: 0.0175937703977,
      sell: 0.0174934355882,
      trend: 'up',
    },
    {
      currencyName: 'CAD',
      buy: 0.0278674179722,
      sell: 0.0277706037051,
      trend: 'up',
    },
    {
      currencyName: 'DKK',
      buy: 0.138609744265,
      sell: 0.1379862289743,
      trend: 'up',
    },
    {
      currencyName: 'JPY',
      buy: 0.0300709373411,
      sell: 0.0297248371822,
      trend: 'up',
    },
    {
      currencyName: 'KWD',
      buy: 0.0062081878547,
      sell: 0.0061942133658,
      trend: 'up',
    },
    {
      currencyName: 'NOK',
      buy: 0.2192886276917,
      sell: 0.2178934065455,
      trend: 'up',
    },
    {
      currencyName: 'SEK',
      buy: 0.21378484693,
      sell: 0.2124901723295,
      trend: 'up',
    },
  ],
  lastUpdated: '2025-02-26T06:58:50.553415815Z',
};

export const FACILITIES_OVERVIEW = {
  lastUpdated: '2025-02-10T11:53:00Z',
  totalAuthorizedLimit: '100000000',
  totalUtilizedLimit: '51000000',
  availableLimit: '49000000',
  maturityDate: '2025-01-22T11:53:00Z',
  facilities: [
    {
      type: 'Overdraft',
      utilized: '5000000',
      authorized: '10000000',
      currency: 'EGP',
    },
    {
      type: 'Loans',
      utilized: '25000000',
      authorized: '50000000',
      currency: 'EGP',
    },
    {
      type: 'LCs',
      utilized: '10000000',
      authorized: '20000000',
      currency: 'USD',
      equivalentEGP: '310000000',
    },
    {
      type: 'Cards',
      utilized: '1000000',
      authorized: '2000000',
      currency: 'USD',
      equivalentEGP: '31000000',
    },
    {
      type: 'LGs',
      utilized: '10000000',
      authorized: '2000000',
      currency: 'USD',
      equivalentEGP: '31000000',
    },
    {
      type: 'IDCs',
      utilized: '10000000',
      authorized: '2000000',
      currency: 'USD',
      equivalentEGP: '31000000',
    },
  ],
};

export const ACCOUNT_DETAILS = {
  nickname: 'Hamada',
  totalAvailableBalance: 6787657,
  accountType: 'Savings',
  accountNumber: '0110038010100101',
  iban: 'EG123456789012345678901234',
  totalBalance: 10000.0,
  availableBalance: 8000.0,
  pendingBalance: 500.0,
  blockedBalance: 1500.0,
  lastUpdated: 1740466650000,
};

export const ACCOUNT_TRANSACTIONS = {
  transactions: [
    {
      accountId: 110038010100101,
      transactionDate: '2024-04-15',
      transactionType: 'UNKNOWN',
      description: null,
      debitAmount: 0,
      creditAmount: 1.2,
      status: 'Pending',
      currencyId: 'EGP',
      balanceAfter: 108782.76,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-03-01',
      transactionType: 'UNKNOWN',
      description: null,
      debitAmount: 0,
      creditAmount: 172.58,
      status: 'Settled',
      currencyId: 'EGP',
      balanceAfter: 108781.56,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-02-01',
      transactionType: 'UNKNOWN',
      description: '11b0b215-0ea7-4248-9edd-f6c9daa36013',
      debitAmount: 5000,
      creditAmount: 0,
      status: 'Settled',
      currencyId: 'EGP',
      balanceAfter: 108608.98,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-02-01',
      transactionType: 'UNKNOWN',
      description: null,
      debitAmount: 0,
      creditAmount: 168.53,
      status: 'Settled',
      currencyId: 'EGP',
      balanceAfter: 113608.98,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-02-01',
      transactionType: 'UNKNOWN',
      description: null,
      debitAmount: 0,
      creditAmount: 6828,
      status: 'Completed',
      currencyId: 'EGP',
      balanceAfter: 113440.45,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-01-21',
      transactionType: 'UNKNOWN',
      description: 'ddd10460-1e82-4bc9-a87b-37cd5131bd45',
      debitAmount: 3500,
      creditAmount: 0,
      status: 'Completed',
      currencyId: 'EGP',
      balanceAfter: 106612.45,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-01-17',
      transactionType: 'UNKNOWN',
      description: 'COVER',
      debitAmount: 0,
      creditAmount: 20000,
      status: 'Completed',
      currencyId: 'EGP',
      balanceAfter: 110112.45,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-01-10',
      transactionType: 'UNKNOWN',
      description: null,
      debitAmount: 3000,
      creditAmount: 0,
      status: 'Completed',
      currencyId: 'EGP',
      balanceAfter: 90112.45,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-01-04',
      transactionType: 'UNKNOWN',
      description: null,
      debitAmount: 0.04,
      creditAmount: 0,
      status: 'Completed',
      currencyId: 'EGP',
      balanceAfter: 93112.45,
    },
    {
      accountId: 110038010100101,
      transactionDate: '2024-01-02',
      transactionType: 'UNKNOWN',
      description: 'e13acc2c-6dfb-4de2-b0bc-06acf46efadf',
      debitAmount: 6000,
      creditAmount: 0,
      status: 'Completed',
      currencyId: 'EGP',
      balanceAfter: 93112.49,
    },
  ],
  totalPages: 13,
  totalRecords: 129,
};

export const ACCOUNT_TRANSACTIONS_EMPTY_DEDUCTED_MOCK = {
  transactions: [],
  pagination: {
    pageSize: 0,
    totalPages: 0,
    pageStart: 0,
    totalSize: 0,
  },
} satisfies AccountTransactionResponse;

export const BANK_LIST = [
  {
    code: 'ABU DHABI COMMERCIAL BANK - EGYPT',
    name: 'ABU DHABI COMMERCIAL BANK - EGYPT',
  },
  {
    code: 'ABU DHABI ISLAMIC BANK - EGYPT',
    name: 'ABU DHABI ISLAMIC BANK - EGYPT',
  },
  {
    code: 'AGRICULTURAL BANK OF EGYPT (A.B.E)',
    name: 'AGRICULTURAL BANK OF EGYPT (A.B.E)',
  },
  {
    code: 'AHLI UNITED BANK (EGYPT) S.A.E.',
    name: 'AHLI UNITED BANK (EGYPT) S.A.E.',
  },
  {
    code: 'AL AHLI BANK OF KUWAIT - EGYPT S.A.',
    name: 'AL AHLI BANK OF KUWAIT - EGYPT S.A.',
  },
  {
    code: 'AL WATANY BANK OF EGYPT',
    name: 'AL WATANY BANK OF EGYPT',
  },
  {
    code: 'ALBARAKA BANK EGYPT',
    name: 'ALBARAKA BANK EGYPT',
  },
  {
    code: 'ARAB AFRICAN INTERNATIONAL BANK',
    name: 'ARAB AFRICAN INTERNATIONAL BANK',
  },
  {
    code: 'ARAB BANK',
    name: 'ARAB BANK',
  },
  {
    code: 'ARAB BANKING CORPORATION EGYPT',
    name: 'ARAB BANKING CORPORATION EGYPT',
  },
  {
    code: 'ARAB INTERNATIONAL BANK',
    name: 'ARAB INTERNATIONAL BANK',
  },
  {
    code: 'Arab Investment Bank',
    name: 'Arab Investment Bank',
  },
  {
    code: 'Attijariwafa Bank Egypt S.A.E',
    name: 'Attijariwafa Bank Egypt S.A.E',
  },
  {
    code: 'BLOM BANK EGYPT S.A.E.',
    name: 'BLOM BANK EGYPT S.A.E.',
  },
  {
    code: 'Bancue Du Caire',
    name: 'Bancue Du Caire',
  },
  {
    code: 'Bank Of Alexandria',
    name: 'Bank Of Alexandria',
  },
  {
    code: 'Banque Misr',
    name: 'Banque Misr',
  },
  {
    code: 'CITIBANK',
    name: 'CITIBANK',
  },
  {
    code: 'CREDIT AGRICOLE EGYPT',
    name: 'CREDIT AGRICOLE EGYPT',
  },
  {
    code: 'Commecial International Bank',
    name: 'Commecial International Bank',
  },
  {
    code: 'EGYPT POST',
    name: 'EGYPT POST',
  },
  {
    code: 'EGYPTIAN ARAB LAND BANK',
    name: 'EGYPTIAN ARAB LAND BANK',
  },
  {
    code: 'EGYPTIAN GULF BANK',
    name: 'EGYPTIAN GULF BANK',
  },
  {
    code: 'EMIRATES NATIONAL BANK OF DUBAI SAE',
    name: 'EMIRATES NATIONAL BANK OF DUBAI SAE',
  },
  {
    code: 'Export Development Bank Of Egypt',
    name: 'Export Development Bank Of Egypt',
  },
  {
    code: 'FAISAL ISLAMIC BANK OF EGYPT',
    name: 'FAISAL ISLAMIC BANK OF EGYPT',
  },
  {
    code: 'First Abu Dhabi Bank Misr S.A.E.',
    name: 'First Abu Dhabi Bank Misr S.A.E.',
  },
  {
    code: 'HOUSING AND DEVELOPMENT BANK',
    name: 'HOUSING AND DEVELOPMENT BANK',
  },
  {
    code: 'HSBC BANK EGYPT',
    name: 'HSBC BANK EGYPT',
  },
  {
    code: 'INDUSTRAIL DEVELOPMENT BANK OF EGYP',
    name: 'INDUSTRAIL DEVELOPMENT BANK OF EGYP',
  },
  {
    code: 'MID BANK',
    name: 'MID BANK',
  },
  {
    code: 'Mashreq Bank',
    name: 'Mashreq Bank',
  },
  {
    code: 'NATIONAL BANK OF GREECE, EGYPT',
    name: 'NATIONAL BANK OF GREECE, EGYPT',
  },
  {
    code: 'Nasser Social Bank',
    name: 'Nasser Social Bank',
  },
  {
    code: 'National Bank of Egypt',
    name: 'National Bank of Egypt',
  },
  {
    code: 'National Investment Bank',
    name: 'National Investment Bank',
  },
  {
    code: 'QATAR NATIONAL BANK ALAHLI',
    name: 'QATAR NATIONAL BANK ALAHLI',
  },
  {
    code: 'Societe Arab International Bank',
    name: 'Societe Arab International Bank',
  },
  {
    code: 'Suez Canal Bank',
    name: 'Suez Canal Bank',
  },
  {
    code: 'THE UNITED BANK',
    name: 'THE UNITED BANK',
  },
  {
    code: 'central bank of egypt',
    name: 'central bank of egypt',
  },
];

export const CHEQUES_OUT_TRACKER = {
  lastUpdatedTimestamp: 1743617701,
  totalPages: 2,
  totalRecords: 20,
  cheques: [
    {
      settlementDate: 1740388892531,
      serialNumber: '746894764890',
      beneficiaryName: 'Test User',
      amount: 50000,
      currency: 'EGP',
      accountNumber: '19300100101',
      status: 'Deducted',
    },
    {
      settlementDate: 1740388892531,
      serialNumber: '746894764890',
      beneficiaryName: 'Test User',
      amount: 50000,
      currency: 'EGP',
      accountNumber: '19300100101',
      status: 'Returned',
    },
    {
      settlementDate: 1740388892531,
      serialNumber: '746894764890',
      beneficiaryName: 'Test User',
      amount: 50000,
      currency: 'EGP',
      accountNumber: '19300100101',
      status: 'Collected',
    },
    {
      settlementDate: 1740388892531,
      serialNumber: '746894764890',
      beneficiaryName: 'Test User',
      amount: 50000,
      currency: 'EGP',
      accountNumber: '19300100101',
      status: 'Unknown',
    },
  ],
};

export const LCS = {
  data: [
    {
      lcNumber: 'TF0935507217',
      cashCover: '307448.31',
      maturityDate: 2240517600000,
      lcType: 'LIDC',
      lcAmount: '307448.31',
      lcCurrency: 'EGP',
      cashCoverPercentage: '100',
      cashCoverCurrency: 'EGP',
      outstandingBalance: '69255.08',
    },
    {
      lcNumber: 'TF1314637240',
      cashCover: '26479700',
      maturityDate: 2240517600000,
      lcType: 'LIDC',
      lcAmount: null,
      lcCurrency: 'JPY',
      cashCoverPercentage: '100',
      cashCoverCurrency: 'EGP',
      outstandingBalance: null,
    },
  ],
  pagination: {
    pageStart: 0,
    pageSize: 10,
    totalSize: 100,
    totalPages: 26,
  },
};

export const LGS = {
  lgList: [
    {
      lgNumber: 'TF0935507217',
      cashCover: '307448.31',
      maturityDate: 2240517600000,
      lgType: 'Advance payment',
      lgAmount: '307448.31',
      currency: 'USD',
      cashCoverPercentage: '100',
      outstandingBalance: '0',
    },
    {
      lgNumber: 'TF0935507218',
      cashCover: '307448.31',
      maturityDate: 2240517600000,
      lgType: 'Advance payment',
      lgAmount: '3078.31',
      currency: 'USD',
      cashCoverPercentage: '80',
      outstandingBalance: '100',
    },
  ],
  totalElements: 52,
  totalSize: 9,
  pageNumber: 1,
};

export const OVERDRAFT_DETAILS = {
  isSecured: true,
  accountNumber: '0110022310120801',
  accountType: 'Current',
  iban: 'EG350017000100110022310120801',
  linkedAccount: '----',
  utilizedAmount: -260,
  pledgedAmount: 0.0,
  availableToUse: 19740.34,
  interestRate: 30.0,
  currency: 'EGP',
  maturityDate: '2024-04-30',
  lastUpdatedTimestamp: '2025-04-21T08:59:12.503253Z',
};

export const LoanDetails = {
  loanDescription: 'car loans$قروض احلال السيارات مبادره %3',
  accountNumber: '0420600810100301',
  totalLoanAmount: 100000,
  tenor: '10 years',
  paidAmount: 1000,
  remainingAmount: 90000,
  totalInstallments: 120,
  totalPaidInstallments: 35,
  remainingInstallments: 85,
  installmentFrequency: 'Monthly',
  maturityDate: '2031-09-01',
  interestRate: 5.4610405,
  installmentAmount: 3643.95,
  installmentDate: '2024-09-01',
  currency: 'EGP',
} satisfies LoanDetailsResponse;

export const LCsDetails = {
  lcSwiftNumber: '123456789',
  goodDescription: 'IRRIGATION EQUIPMENT',
  lcAmount: 742140.69,
  currency: 'USD',
  lcType: 'LIDC',
  lcTypeDescription: 'LC Import Deffer Confirmed & no Col',
  beneficiaryName: 'Mahmoud Mostafa',
  expiryDate: '2008-12-31',
  dueDate: '2027-09-13',
  lcCountry: 'USA',
  outstandingLimit: 746061.17,
  remainingLimit: 0,
  cashCover: 742140.69,
  cashCoverCurrency: 'USD',
  cashCoverPercentage: 100,
  lastUpdatedTimestamp: '2025-04-28T11:46:55.498414Z',
  isDeferred: false,
} satisfies LCsDetailsResponse;

export const LGsDetails = {
  beneficiaryName: 'الاداره العامه لجمارك السويس و البحر',
  cashCoverAmount: null,
  cashCoverAmountCurrency: null,
  cashCoverPercentage: 0,
  commissionsDebitedAccount: '0130370310100101',
  expiryDate: '2099-12-31',
  issuanceDate: '1991-10-21',
  lastUpdatedTimestamp: '2025-05-01T10:30:47.691766611Z',
  lgAmount: 1000,
  lgNumber: 'LD0636210867',
  lgType: 'FINAL نهائي',
  linkedCashCoverAccount: '0130370310100101',
  numberOfExtensions: 134,
  oldNumber: '149149',
  secure: false,
  purpose: 'ضمان سداد مطالبات خاصه',
  lgCurrency: 'USD',
} satisfies LGsDetailsResponse;

export const IDCDetails = {
  idcSwiftNumber: '123456789',
  goodDescription: 'IRRIGATION EQUIPMENT',
  idcAmount: 31714.0,
  currency: 'USD',
  idcType: 'DIS',
  idcTypeDescription: 'Coll Inward Sight Confirmed',
  exporterName: 'EGYPT FOR MEDICAL CLOTHES EGYPT FOR MEDICAL CLOTHES',
  idcCountry: 'CN',
  dueDate: '2027-09-13',
  cashCover: 31714.0,
  cashCoverCurrency: 'USD',
  cashCoverPercentage: 100,
  lastUpdatedTimestamp: '2025-04-28T11:58:26.700874Z',
  isDeferred: false,
} satisfies IdcDetailsResponse;

export interface IdcDetailsResponse {
  idcSwiftNumber: string;
  goodDescription: string | null;
  idcAmount: number;
  currency: string;
  idcType: string;
  idcTypeDescription: string;
  exporterName: string;
  idcCountry: string | null;
  dueDate: string | null;
  cashCover: number;
  cashCoverCurrency: string;
  cashCoverPercentage: number;
  isDeferred: boolean;
  lastUpdatedTimestamp: string;
}

export interface LoanDetailsResponse {
  loanDescription: string;
  accountNumber: string;
  totalLoanAmount: number;
  tenor: string;
  paidAmount: number;
  remainingAmount: number;
  totalInstallments: number;
  totalPaidInstallments: number;
  remainingInstallments: number;
  installmentFrequency: string;
  maturityDate: string;
  interestRate: number;
  installmentAmount: number;
  installmentDate: string;
  currency: string;
}

export interface OverdraftResponse {
  pagination: Pagination;
  overdraftsList: Overdraft[];
}

export interface Overdraft {
  accountNumber: string;
  accountName: string;
  currency: string;
  utilizedAmount: number;
  dueAmount: number;
  dueDate: string;
}

export interface UpcomingDuesList {
  transactionDate: string;
  referenceNumber: string | null;
  remainingAmount: number | null;
  dueAmount: number;
  currency: string | null;
  dueDate: string;
}

export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface UpcomingDuesResponse {
  lastUpdatedTimestamp: string;
  upcomingDues: UpcomingDuesList[];
  pagination: Pagination;
}

export interface TransactionsList {
  transactionDate: string;
  description: string;
  referenceNumber: string;
  debitAmount: number;
  creditAmount: number;
  currencyId: string;
  balanceAfter: number;
}

export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface TransactionsResponse {
  transactions: TransactionsList[];
  pagination: Pagination;
}

export const AD_ALL_LIST = {
  accounts: [
    {
      accountNumber: '1320003110100102',
      productName: 'Current Account',
      availableBalance: 1285751.48,
      currency: 'EGP',
      accountType: 'Current Account',
    },
    {
      accountNumber: 'LD2310801029',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'CD',
    },
    {
      accountNumber: 'LD2310802060',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'CD',
    },
    {
      accountNumber: 'LD2310802583',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'CD',
    },
    {
      accountNumber: 'LD2310803065',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'CD',
    },
    {
      accountNumber: 'LD2310803613',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'CD',
    },
    {
      accountNumber: 'LD2310804559',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'CD',
    },
    {
      accountNumber: 'LD2310805630',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'CD',
    },
    {
      accountNumber: 'LD2310805970',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'TD',
    },
    {
      accountNumber: 'LD2310806257',
      productName: 'ONE MILLION EGP MONTHLY(3YEARS) شهادة ثلاثية-شهرى',
      availableBalance: 1000000,
      currency: 'EGP',
      accountType: 'TD',
    },
  ],
  equivalentBalanceEGP: 10285751.48,
  lastUpdatedTimestamp: '2025-04-24T11:23:18.931646469Z',
  pagination: {
    pageStart: 0,
    totalSize: 88,
    pageSize: 10,
    totalPages: 9,
  },
};

export const FACILITIES_TYPES_DATA = {
  idcTypes: [
    {
      key: 'DIS',
      value: 'Coll Inward Sight Confirmed',
    },
    {
      key: 'DOST',
      value: 'مستندات برسم التحصيل تصدير بالاطلاع',
    },
    {
      key: 'DIAF',
      value: 'Coll Inward Acceptance Confirmed',
    },
    {
      key: 'DIF',
      value: 'DOC COLLECTION INWARD FREE OF PAYMENT',
    },
    {
      key: 'DIAW',
      value: 'Coll Inward Acceptance Confirmed',
    },
  ],
  lcTypes: [
    {
      key: 'LISC',
      value: 'LC Import Sight Confirmed',
    },
    {
      key: 'LISU',
      value: 'LC Import Sight Unconferm & Uncoll',
    },
    {
      key: 'LEDU',
      value: 'LC Export Deffered Unconfirmed',
    },
    {
      key: 'LIDC',
      value: 'LC Import Deffer Confirmed & no Col',
    },
    {
      key: 'LIDU',
      value: 'LC Import Deffer Unconferm & Uncoll',
    },
    {
      key: 'LEDC',
      value: 'اعتماد تصدير تسهيلات معزز',
    },
    {
      key: 'LIMC',
      value: 'LC IMPORT - MIXED PMT CONFIRMED',
    },
    {
      key: 'LIMU',
      value: 'LC IMPORT - MIXED PMT UNCONFIRMED',
    },
    {
      key: 'LESU',
      value: 'LC Export Sight Unconfirmed',
    },
    {
      key: 'LEMU',
      value: 'LC Export Mixed Unconfirmed',
    },
    {
      key: 'LESC',
      value: 'اعتماد تصدير بالاطلاع معزز',
    },
  ],
  LG_TYPES: [
    {
      key: 'ADVANCE',
      value: 'ADVANCE',
    },
    {
      key: 'BIDBOND',
      value: 'BIDBOND',
    },
    {
      key: 'FINAL',
      value: 'FINAL',
    },
    {
      key: 'ADVANCE',
      value: 'دفعات',
    },
    {
      key: 'BIDBOND',
      value: 'إبتدائى',
    },
    {
      key: 'FINAL',
      value: 'نهائي',
    },
  ],
};

export interface LCsDetailsResponse {
  lcSwiftNumber: string;
  goodDescription: string;
  lcAmount: number;
  currency: string;
  lcType: string;
  lcTypeDescription: string;
  beneficiaryName: string;
  expiryDate: string;
  dueDate: string | null;
  lcCountry: string;
  outstandingLimit: number;
  remainingLimit: number;
  cashCover: number;
  cashCoverCurrency: string;
  cashCoverPercentage: number;
  isDeferred: boolean;
  lastUpdatedTimestamp: string;
}

export interface LGsDetailsResponse {
  beneficiaryName: string;
  cashCoverAmount: number | null;
  cashCoverAmountCurrency: string | null;
  cashCoverPercentage: number;
  commissionsDebitedAccount: string;
  expiryDate: string; // ISO date string
  issuanceDate: string; // ISO date string
  lastUpdatedTimestamp: string; // ISO timestamp with time
  lgAmount: number;
  lgNumber: string;
  lgType: string;
  linkedCashCoverAccount: string | null;
  numberOfExtensions: number;
  oldNumber: string;
  secure: boolean;
  purpose: string;
  lgCurrency: string;
}

export const CREDIT_CARD = {
  ccList: [
    {
      ccNumber: '524815******5806',
      holderName: 'TEST CARD 13',
      availableToUse: 50650.49,
      utilizedAmount: 0,
      dueAmount: 0,
      dueDate: '2023-05-26',
      currency: 'EGB',
    },
  ],
  pagination: {
    pageStart: 0,
    totalSize: 50,
    pageSize: 10,
    totalPages: 5,
  },
};
