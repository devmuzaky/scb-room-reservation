import { TimeDepositsDetailsResponse } from './time-deposits';

export const MOCK_TIME_DEPOSITS_DETAILS_RESPONSE: TimeDepositsDetailsResponse = {
  tdNumber: 'TD0001',
  interestCreditDate: '2024-07-15',
  tdType: 'T.D-Three Years ودائع -3سنوات',
  tdName: 'T.D-Three Years ودائع -3سنوات',
  displayName: 'T.D-Three Years ودائع -3سنوات',
  issuanceDate: '2025-04-13',
  maturityDate: null,
  tenor: '3 Years',
  tenorInMonths: '36',
  maturityLeft: '35m 24d',
  maturityRemaining: '35m 24d',
  interestRate: 0.25,
  interestAmount: 1500.0,
  balance: 1500.0,
  currency: 'EGP',
  equivalentBalanceInEGP: 1500.0,
  actionAtMaturity: 'Redeem',
  linkedAccounts: {
    debitedAccount: '1320003110100102',
    redeemAccount: '1320003110100102',
    interestAccount: '1320003110100102',
  },
  matured: false,
};
