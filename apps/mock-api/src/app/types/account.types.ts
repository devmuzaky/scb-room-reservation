import { Pagination } from './common.types';

export interface CurrencySummary {
  currency: string;
  totalAmount: number;
  equivalentInEGP: number;
  totalAccounts?: number;
  timeDepositsCount?: number;
  certificatesCount?: number;
}

export interface AccountSummary {
  equivalentInEGP: string | number;
  accountsList: CurrencySummary[];
}

export interface AccountOverview {
  lastUpdateAt: string;
  accounts: AccountSummary;
  deposits: AccountSummary;
  certificates: AccountSummary;
}

export interface AccountOverviewResponse {
  accountsOverView: AccountOverview;
}

export interface AccountDetails {
  nickname: string;
  totalAvailableBalance: number;
  accountType: string;
  accountNumber: string;
  iban: string;
  totalBalance: number;
  availableBalance: number;
  pendingBalance: number;
  blockedBalance: number;
  lastUpdated: number;
}

export interface AccountListResponse {
  accounts: AccountDetails[];
  pagination: Pagination;
}
