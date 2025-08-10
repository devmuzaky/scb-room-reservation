export interface Account {
  accountNumber: string;
  accountNickName: string;
  accountType: string;
  availableBalance: number;
  currency: string;
}

export interface AccountData {
  lastUpdatedTimestamp: number;
  totalBalance: number;
  totalRecords?: number;
  totalPages: number;
  accountList: Account[];
}
