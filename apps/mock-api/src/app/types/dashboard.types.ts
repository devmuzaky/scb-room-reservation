export interface AccountOverviewResponse {
  accountsOverView: {
    lastUpdateAt: string;
    accounts: {
      equivalentInEGP: string;
      accountsList: Account[];
    };
    deposits: {
      equivalentInEGP: number;
      depositsList: Deposit[];
    };
    certificates: {
      equivalentInEGP: number;
      certificatesList: Certificate[];
    };
  };
}

export interface Account {
  currency: string;
  totalAmount: number;
  equivalentInEGP: number;
  totalAccounts: number;
}

export interface AccountList {
  accountNumber: string;
  accountNickName: string;
  accountType: string;
  availableBalance: number;
  currency: string;
}

export interface Deposit {
  currency: string;
  totalAmount: string;
  equivalentInEGP: number;
  timeDepositsCount: number;
}

export interface Certificate {
  currency: string;
  totalAmount: number;
  equivalentInEGP: number;
  certificatesCount: number;
}
export interface CertificateList {
  CdNumber: string;
  amount: number;
  currency: string;
  interestRate: string;
  maturityDate: string;
  type: string;
}

export interface AccountTransaction {
  accountId: number;
  transactionDate: string; // Consider using Date if you plan to parse it
  transactionType: string;
  description: string | null;
  detailedDescription: string;
  debitAmount: number;
  creditAmount: number;
  status: string;
  currencyId: string;
  balanceAfter: number;
  referenceNumber: string;
  type?: string;
}

export interface AccountTransactionResponse {
  transactions: AccountTransaction[];
  pagination: Pagination;
}

export interface LoansListResponse {
  pagination: Pagination;
  loansList: Loan[];
}

export type Loan = {
  accountNumber: string;
  accountName: string;
  loanBalance: number;
  loanId: string;
  installmentAmount: number;
  installmentDate: string;
};
export interface IdcList {
  idcNumber: string;
  idcAmount: number;
  dueDate: string;
  idcDrawer: string;
  idcType: string;
  idcTypeDescription?: string;
  status: string;
  idcCurrency: string;
}

export interface Pagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface IdcResponse {
  data: IdcList[];
  pagination: Pagination;
}

export interface CcListResponse {
  pagination: Pagination;
  ccList: CcList[];
}

export type CcList = {
  ccNumber: string;
  holderName: string;
  availableToUse: number;
  utilizedAmount: number;
  dueAmount: number;
  dueDate: string;
  currency: string;
  creditCardNumber: string;
};

export interface CcTransactionResponse {
  pagination: Pagination;
  transactions: CcTransaction[];
}

export type CcTransaction = {
  accountId: number;
  transactionDate: string;
  transactionType: string;
  transactionCategory: string;
  transactionCode: string;
  description: string;
  referenceNumber: string;
  debitAmount: number;
  creditAmount: number;
  status: string;
  currencyId: string;
  balanceAfter: number;
};

export interface CreditCardDetails {
  cardLimit: number;
  availableBalance: number;
  utilizedAmount: number;
  heldAmount: number;
  dueAmount: number;
  dueDate: string;
  currency: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  companyName: string;
}
