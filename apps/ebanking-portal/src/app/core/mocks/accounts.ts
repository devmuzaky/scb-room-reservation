import { AccountTransactionResponse } from '../../home/account-details/account-details.models';

export const AccountDataResponse = {
  lastUpdatedTimestamp: 1741773783314,
  totalBalance: 4864036.92,
  totalPages: 3,
  accountList: [
    {
      accountNumber: '1310098710100101',
      accountNickName: 'محمود محمد محمد السيد ابراهيم',
      accountType: 'Current Account',
      availableBalance: 4862010.32,
      currency: 'EGP',
    },
    {
      accountNumber: '1310098710102001',
      accountNickName: 'MAHMOUD MOHAMED IBRAHIEM',
      accountType: 'Buy Resid.Units',
      availableBalance: 1926.6,
      currency: 'EGP',
    },
    {
      accountNumber: '1310098710100102',
      accountNickName: 'MAHMOUD MOHAMED IBRAHIEM',
      accountType: 'Current Account',
      availableBalance: 100,
      currency: 'EGP',
    },
  ],
};

export const ACCOUNT_DETAILS = {
  nickname: null,
  totalAvailableBalance: null,
  accountType: 'Savings',
  accountNumber: '0110038010100101',
  iban: 'EG123456789012345678901234',
  totalBalance: 10000.0,
  availableBalance: 8000.0,
  pendingBalance: 500.0,
  blockedBalance: 1500.0,
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
  totalPages: 13,
  totalRecords: 129,
} satisfies AccountTransactionResponse;

export const PDFResponse =
  'JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDEyMDI+PnN0cmVhbQp4nO2YS1MjNxCA7/MrdCQXraTRY+Zodh1MVUiy4KpUjmbWpJKMzUJBUvvvo5a6JY3Bg5XikEOW2rV6UX/9 UKtb8NBIqbhhwn9p4RdGMmdgMeyaD5c7yT7dN5+bh8b/v9WSm47tYO2U4b1lY1z3XDlmWm575loJ3zCOVkNjtCZhDAKCxgI6Nr80+wCLG72Rtiu1JG/TNwMQjYalyYZeZWcu2ske7VDL4c4g6IgONhEC7uByOMqeREqGctpcoRWSRWyZbEpyZTgOnoQJVh4ayeDr8bfCM923rBfcu/24 be78Gf5/iv/tUzSSO0Np2CWx452/lZpHjpJ0KH41pPR6AYgtV6Y41CjnrITgFW9bEFyxDqbyvtKR8bBOcvCTc5qEJqdr0g5RZo/h0ATvU1zkPkZcBjO8WzCuyNckeZNCnQZwSsileqyZ0t9dljW3vlZC4OhzEcrwLqG8VQeHV6U+7 qQeQk0uQ5hcprjQ/RhxGcvwfrEcLQP3Lyo1byq0Y4cVvLPWOnb4CT3XFbcWnM/OHjPl8qa70Jjn8Bm5w3jdSeVYZSEXqisr7lgSSzfe5rsJftJZjma/gL/pvmK2t7yHArQtrUday+ixeimEXdH983Xz4Xs/RFv/9 FnfgaoTHdeKrb80Z6vLixW7WS+XP7DrxdWv7Ga1WJwvfmSX59eL1fKKXf20WlwtP323/qNZrjNOMakQZp2/BQ5ggitGf73zZx/vd183+2/sclbdOC7b19SlbYWQQhTKvrX4FPs33cFneB7AtTOd5aplUmouJGt7bumNkPMQLYtwaYVC388Ww3D/vH9i++fd7fbxNJvSWu5PF412/rVp5mxKZ2C7FT0UQGEUrJ2xwyQdqJnecBfVnr593Z7modI975KHveS6m/NQmQ62F2lZ3z9tRna7GTf74USbrW9UIh+F8Eeh54y2/uiEmaTlr83v4+Z23M4nBhWLxFT5qbXlXZtyY+FKzLipjYHthZvn4/3 w5/bLvJOo9paTrf/DDj+vL5pQpn9DdUNfUpYeuCCazsB5js3NiRSoV6kzBuVqDlSVLjgoV3Na3xZ9nSUOytUcOEltMwflag6MYGhJKc1RrufIwAgPQewRKNeclS8Ymzl4k6s5oCcKDt7Oag6cTZsxeHmqMaAnuswxWEdVkNBz/bWyOb8oV+c3cVKnrORgfhMndb9KTsxvwqTmVInB/CaOwXtZQKYTOOgZG96W0J1o6kr859jopqlke+ieoPnx+fFxG4fZawpKKi5dqfCiZ6rpGCq2tkZ1yruqX2+2 h4q+5+qouLz4+dhmGh859mSFzahRQ89q4mA7zBj/ymOHn/mVInvQxVeKfzN2eebMKFOpR+343 Jgqv3pC8FNn9yLhM3boKkQ78dFwspNU/xhinP4na1PZo+kwk18onzQrcaynWSm7+OqunJUJQ3ItJ81G5JBcy0mzETkk13LSbEQOybWcNBspzShXc+DXI6FQcy+Pcn0vJw4VcC2HejlxqJZrOdjLCUNFXYuhXk6c0MtrIaFhdPFH7NRAuviTaW1+iZMaRCWH8kuc1CsqOZhfwqSmUYmh/BLH4L0sID5b2hc2/tJZQBuCX5p8bv4BAWTkfQplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwvQ29udGVudHMgNSAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNiAwIFIvRjIgNyAwIFI+Pi9YT2JqZWN0PDwvSW0xIDggMCBSPj4+Pi9UcmltQm94WzAgMCA1OTUgODQyXS9UeXBlL1BhZ2U+PgplbmRvYmoKMyAwIG9iago8PC9DcmVhdGlvbkRhdGUoRDoyMDI1MDMyMTEzMTE1NFopL01vZERhdGUoRDoyMDI1MDMyMTEzMTE1NFopL1Byb2R1Y2VyKGlUZXh0riBDb3JlIDguMC4zIFwoQUdQTCB2ZXJzaW9uXCksIHBkZkhUTUwgNS4wLjMgXChBR1BMIHZlcnNpb25cKSCpMjAwMC0yMDI0IEFwcnlzZSBHcm91cCBOVikvVGl0bGUoQmFuayBTdGF0ZW1lbnQpPj4KZW5kb2JqCjEgMCBvYmoKPDwvUGFnZXMgMiAwIFIvVHlwZS9DYXRhbG9nPj4KZW5kb2JqCjYgMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtQm9sZC9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvU3VidHlwZS9UeXBlMS9UeXBlL0ZvbnQ+PgplbmRvYmoKNyAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1Sb21hbi9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvU3VidHlwZS9UeXBlMS9UeXBlL0ZvbnQ+PgplbmRvYmoKMiAwIG9iago8PC9Db3VudCAxL0tpZHNbNCAwIFJdL1R5cGUvUGFnZXM+PgplbmRvYmoKOCAwIG9iago8PC9CaXRzUGVyQ29tcG9uZW50IDgvQ29sb3JTcGFjZVsvQ2FsUkdCIDw8L0dhbW1hWzIuMiAyLjIgMi4yXS9NYXRyaXhbMC40MTIzOSAwLjIxMjY0IDAuMDE5MzMgMC4zNTc1OCAwLjcxNTE3IDAuMTE5MTkgMC4xODA0NSAwLjA3MjE4IDAuOTUwNF0vV2hpdGVQb2ludFswLjk1MDQzIDEgMS4wOV0+Pl0vRmlsdGVyL0ZsYXRlRGVjb2RlL0hlaWdodCA1NC9JbnRlbnQvUGVyY2VwdHVhbC9MZW5ndGggMzcwL1NNYXNrIDkgMCBSL1N1YnR5cGUvSW1hZ2UvVHlwZS9YT2JqZWN0L1dpZHRoIDE1MD4+c3RyZWFtCnic7dg9TsMwFMDxHIudjZmBkQu48cSMuAEjEifgElETRZ04k4nzGtfxRyUgqSXr/1 NUVc8fkv3UPLtNAwAAAAAAAAAAAAAAAAAAAKTdPb+q3ujOBPGHt6+nz2/dh/Gp5+N71/bm/uUjbjoMJjmbHhJBbMJu+9 E+U1Ls5g/2 i0Tc087xZJMdMtrPoMkOmZ6TzakLll5rnVwGb/CUXmudJINttNvt/DLM5UJ16Z+qujpb6bVWS/b2nMp5q8+R0bgOkgjXU5qkp02lG3Iy2dnI4D7cVrsTSFDvpKJJT91HTUsqD96o3GxlV1qrXetg8DotvdY62ddgbv/7 a02/HaJ4i+7 JP8/4 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';

export const CSVResponse =
  '77 u/IkFjY291bnQgTnVtYmVyIiwiQWNjb3VudCBUeXBlIiwiTmlja25hbWUiLCJUb3RhbCBCYWxhbmNlIiwiQXZhaWxhYmxlIEJhbGFuY2UiLCJCbG9ja2VkIEJhbGFuY2UiLCJDdXJyZW5jeSIKIjE2MzAwMTAwMTAxMDAxMDEiLCJDdXJyZW50IEFjY291bnQiLCLZh9in2Yog2LPYqtmK2YQiLCIzNTI4MjAuNzQiLCIzNTI4MjAuNzQiLCIwIiwiRUdQIgo=';
