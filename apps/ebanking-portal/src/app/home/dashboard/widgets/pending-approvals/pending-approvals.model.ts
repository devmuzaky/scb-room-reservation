export interface Transaction {
  transactionId: string;
  transactionType: string;
  submittedBy: string;
  submittedAt: string;
  status: string;
  amount: {
    currency: string;
    value: number;
  };
}

export interface TransactionGroup {
  groupId: string;
  groupName: string;
  groupDescription: string;
  transactions: Transaction[];
}

export interface TransactionResponse {
  status: string;
  lastUpdatedTimestamp: string;
  groups: TransactionGroup[];
}

export enum ApproverTypes {
  MAKER = 'maker',
  CHECKER = 'checker',
}

export enum PendingApprovalTypes {
  TRANSFER = 'Transfers',
  PAYMENTS = 'Payments',
  REQUEST = 'Requests',
}

export interface TransactionDetail {
  icon: string;
  heading: string;
  description: string;
  totalTransactions: number;
}

export const Tabs = [
  {
    name: 'maker',
    id: 'maker',
  },
  {
    name: 'checker',
    id: 'checker',
  },
];
