export interface CertificateDetailsResponse {
  cdNumber: string;
  cdType: string;
  cdName: string;
  displayName: string;
  issuanceDate: string;
  maturityDate: string;
  tenorInMonths: number;
  maturityRemaining: number;
  interestRate: number;
  interestAmount: number;
  interestCreditDate: string;
  interestFrequency: string;
  balance: number;
  currency: string;
  equivalentBalanceInEGP: number;
  actionAtMaturity: string;
  matured: boolean;
  linkedAccounts: {
    debitedAccount: string;
    redeemAccount: string;
    interestAccount: string;
  };
}
