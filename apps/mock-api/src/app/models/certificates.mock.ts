import { CertificateDetailsResponse } from './certificates';

export const MOCK_CERTIFICATES_DETAILS_RESPONSE = {
  cdNumber: 'CD-1234-1232-3231-3231',
  cdType: 'CD',
  cdName: 'CD hamada',
  displayName: 'Fixed Term Deposit',
  issuanceDate: '2024-01-15',
  maturityDate: '2025-01-15',
  tenorInMonths: 3,
  maturityRemaining: 1,
  interestRate: 5.25,
  interestAmount: 2625.0,
  interestCreditDate: '2024-07-15',
  interestFrequency: 'tt',
  balance: 50000.0,
  currency: 'USD',
  equivalentBalanceInEGP: 5000,
  actionAtMaturity: 'no',
  matured: false,
  linkedAccounts: {
    debitedAccount: '1234567890123456',
    redeemAccount: '1234567890123456',
    interestAccount: '6543210987654321',
  },
} satisfies CertificateDetailsResponse;
