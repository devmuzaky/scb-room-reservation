export interface TimeDeposit {
  tdNumber: string;
  tdType: string;
  tdAmount: number;
  currency: string;
  interestRate: number;
  maturityDate: string; // Consider using Date type if appropriate
  tenor: string;
  interestFrequency?: string;
}

export interface TimeDepositsResponse {
  totalAmount: number;
  totalPages: number;
  lastUpdated: string;
  totalSize: number;
  tdList: TimeDeposit[];
}
export interface TimeDepositsDetailsResponse {
  tdNumber: string;
  tdType: string;
  tdName: string;
  displayName: string;
  issuanceDate: string;
  maturityDate: string;
  tenor: string;
  maturityLeft: number | string;
  interestRate: number | string;
  interestAmount: number | string;
  maturityRemaining: number | string;
  interestCreditDate: string;
  balance: number;
  currency: string;
  equivalentBalanceInEGP: number;
  actionAtMaturity: string;
  tenorInMonths: number | string;
  matured: boolean;
  linkedAccounts: {
    debitedAccount: string;
    redeemAccount: string;
    interestAccount: string;
  };
}
