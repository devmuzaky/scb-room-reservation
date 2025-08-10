import { Injectable } from '@nestjs/common';
import { ACCOUNT_DETAILS, ACCOUNT_OVERVIEW_RESPONSE_MOCK } from '../models/dashboard';
import { AccountDetails } from '../types/account.types';
import { AccountList, AccountTransaction, AccountTransactionResponse } from '../types/dashboard.types';

@Injectable()
export class AccountService {
  private accounts: AccountList[] = [];
  private accountTransaction: AccountTransaction[] = [];

  constructor() {
    this.generateMockAccounts(100);
    this.generateMockAccountTransactions(100);
  }

  getAccountDetails(accountNumber: string): AccountDetails {
    return ACCOUNT_DETAILS;
  }

  getAccountOverview() {
    return ACCOUNT_OVERVIEW_RESPONSE_MOCK;
  }

  paginateAccounts(page: number, pageSize: number, currencies: string) {
    let filteredAccounts = this.accounts;

    if (currencies) {
      const currencyList = currencies.split(',').map(currency => currency.trim());
      filteredAccounts = this.accounts.filter(account => currencyList.includes(account.currency));
    }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

    const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.availableBalance, 0);

    const totalPages = Math.ceil(filteredAccounts.length / pageSize);

    return {
      lastUpdatedTimestamp: Date.now(),
      totalBalance: totalBalance,
      totalPages: totalPages,
      totalRecords: filteredAccounts.length,
      accountList: paginatedAccounts,
    };
  }

  private generateMockAccounts(count: number): void {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'EGP', 'AUD'];
    for (let i = 0; i < count; i++) {
      this.accounts.push({
        accountNumber: `ACC-${i + 1}`,
        accountNickName: `Account ${i + 1}`,
        accountType: i % 2 === 0 ? 'Savings' : 'Checking',
        availableBalance: Math.floor(Math.random() * 10000),
        currency: currencies[i % currencies.length],
      });
    }
    // Sort the accounts based on the specified currency order and then by availableBalance in descending order
    const currencyOrder = ['EGP', 'USD', 'EUR', 'GBP'];
    this.accounts.sort((a, b) => {
      const indexA = currencyOrder.indexOf(a.currency);
      const indexB = currencyOrder.indexOf(b.currency);

      // If both currencies are in the specified order, sort by their index
      if (indexA !== -1 && indexB !== -1) {
        if (indexA === indexB) {
          // If currencies are the same, sort by availableBalance in descending order
          return b.availableBalance - a.availableBalance;
        }
        return indexA - indexB;
      }

      // If one currency is in the specified order, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither currency is in the specified order, sort alphabetically by currency
      const currencyComparison = a.currency.localeCompare(b.currency);
      if (currencyComparison === 0) {
        // If currencies are the same, sort by availableBalance in descending order
        return b.availableBalance - a.availableBalance;
      }
      return currencyComparison;
    });
  }

  paginateTransactions(
    page: number,
    pageSize: number,
    accountId: string,
    transactionType?: string,
    type?: string,
    status?: string,
  ) {
    const hasTransactionType = transactionType?.trim().length > 0;
    const hasType = type?.trim().length > 0;
    const hasStatus = status?.trim().length > 0;

    let filteredTransactions = this.accountTransaction;

    if (hasTransactionType || hasType || hasStatus) {
      filteredTransactions = this.accountTransaction.filter(account => {
        const matchesTransactionType = hasTransactionType
          ? transactionType
              .split(',')
              .map(t => t.trim())
              .includes(account.transactionType)
          : true;

        const matchesType = hasType ? account.type === type : true;

        const matchesStatus = hasStatus ? account.status === status : true;

        return matchesTransactionType && matchesType && matchesStatus;
      });
    }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTransactions.length / pageSize);

    return {
      pagination: {
        pageStart: page,
        totalSize: filteredTransactions.length,
        pageSize: pageSize,
        totalPages: totalPages,
      },
      transactions: paginatedTransactions,
    } satisfies AccountTransactionResponse;
  }

  private generateMockAccountTransactions(count: number): void {
    const currencies = ['USD', 'EUR', 'GBP'];
    const transactionTypes = ['TRANSFER', 'WITHDRAWAL', 'DEPOSIT', 'CHEQUE', 'UNKNOWN'];
    const statuses = ['COMPLETED', 'PENDING', 'RECENT'];
    const type = ['DEBIT', 'CREDIT'];

    for (let i = 0; i < count; i++) {
      const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const debitAmount = Math.floor(Math.random() * 1000) + 0.12;
      const creditAmount = Math.floor(Math.random() * 1000) + 0.24;

      this.accountTransaction.push({
        accountId: Math.floor(Math.random() * 10) + 1,
        transactionDate: Date.now().toString(),
        transactionType: transactionType,
        description: Math.random() > 0.5 ? `Transaction ${i + 1}` : null,
        detailedDescription: `Details ${i}`,
        debitAmount: debitAmount,
        creditAmount: creditAmount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        currencyId: currencies[Math.floor(Math.random() * currencies.length)],
        balanceAfter: Math.floor(Math.random() * 10000),
        referenceNumber: `TF25103${i.toString().padStart(5, '0')}`,
        type: type[Math.floor(Math.random() * type.length)],
      });
    }
  }
}
