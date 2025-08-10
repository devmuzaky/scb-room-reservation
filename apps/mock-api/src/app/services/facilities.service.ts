import { Injectable } from '@nestjs/common';
import {
  FACILITIES_OVERVIEW,
  FACILITIES_TYPES_DATA,
  IDCDetails,
  LCS,
  LCsDetails,
  LGsDetails,
  LoanDetails,
  Overdraft,
  OVERDRAFT_DETAILS,
} from '../models/dashboard';
import {
  CcList,
  CcListResponse,
  CcTransaction,
  CcTransactionResponse,
  CreditCardDetails,
  IdcList,
  Loan,
  LoansListResponse,
} from '../types/dashboard.types';

@Injectable()
export class FacilitiesService {
  private lgsList: any[] = [];
  private loansList: Loan[] = [];
  private overdraftList: Overdraft[] = [];
  private idcList: IdcList[] = [];
  private ccList: CcList[] = [];
  private ccTransactions: CcTransaction[] = [];

  constructor() {
    this.generateMockLgsList(100);
    this.generateMockLoans(100);

    this.generateMockOverdrafts(100);
    this.generateMockIDCList(100);
    this.generateMockCcList(100);
    this.generateMockCcTransactions(100);
  }

  getFacilitiesOverview() {
    return FACILITIES_OVERVIEW;
  }

  getLoans(page: string, size: string) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(size, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return { error: 'Invalid page or pageSize' };
    }

    return this.paginateLoans(pageNumber, pageSizeNumber);
  }

  getLoanDetails(loanId: string) {
    return LoanDetails;
  }

  getOverdraftsList(page: string, size: string) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(size, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return { error: 'Invalid page or pageSize' };
    }

    return this.paginateOverdraftList(pageNumber, pageSizeNumber);
  }

  getLcs(lcType: string, page: number, size: number) {
    return LCS;
  }

  getOverdraftDetails(accountNumber: string) {
    return OVERDRAFT_DETAILS;
  }

  getLgs(lgType: string, page: number, size: number) {
    return this.paginateLGsList(page, size, lgType);
  }

  getIDC(idcType: string, status: string, page: number, size: number) {
    return this.paginateIDCsList(page, size, status, idcType);
  }

  /// pagination methods
  paginateLGsList(page: number, pageSize: number, lgType?: string) {
    let filteredLGS = this.lgsList;

    if (lgType) {
      filteredLGS = this.lgsList.filter(account => account.lgType === lgType);
    }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedLg = filteredLGS.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredLGS.length / pageSize);

    return {
      pagination: {
        pageStart: page,
        totalSize: filteredLGS.length,
        pageSize: pageSize,
        totalPages: totalPages,
      },
      lgList: paginatedLg,
    };
  }

  private generateMockLgsList(count: number): void {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'EGP', 'AUD'];
    for (let i = 0; i < count; i++) {
      this.lgsList.push({
        lgNumber: `1232-3231-3231${i}`,
        oldNumber: `1232${i}`,
        lgType: ` Floating LG of Deposit ${i + 1}`,
        cashCover: Math.floor(Math.random() * 10000),
        lgAmount: Math.random() < 0.3 ? null : Math.floor(Math.random() * 10000),
        currency: currencies[i % currencies.length],
        interestRate: (Math.random() * (10 - 1) + 1).toFixed(2) + '%',
        maturityDate: Date.now().toString(),
        tenor: '3 Months',
      });
    }
  }

  paginateLoans(page: number, pageSize: number) {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedLoans = this.loansList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.loansList.length / pageSize);

    return {
      pagination: {
        pageStart: page,
        totalSize: this.loansList.length,
        pageSize: pageSize,
        totalPages: totalPages,
      },
      loansList: paginatedLoans,
    } satisfies LoansListResponse;
  }

  private generateMockLoans(count: number): void {
    for (let i = 0; i < count; i++) {
      this.loansList.push({
        accountNumber: `ACC-${i + 1}`,
        accountName: `Account ${i + 1}`,
        loanBalance: Math.random() < 0.3 ? null : Math.floor(Math.random() * 10000), // 30% chance to be null
        loanId: `LOAN-${i + 1}`,
        installmentAmount: Math.random() < 0.3 ? null : Math.floor(Math.random() * 1000), // 30% chance to be null
        installmentDate: new Date().toISOString(),
      });
    }
  }

  paginateOverdraftList(page: number, pageSize: number) {
    const filteredOverdraft = this.overdraftList;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedOverdrafts = filteredOverdraft.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredOverdraft.length / pageSize);

    return {
      overdraftsList: paginatedOverdrafts,
      pagination: {
        totalSize: filteredOverdraft.length,
        totalPages,
        pageStart: page,
        pageSize,
      },
    };
  }

  private generateMockOverdrafts(count: number): void {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'EGP', 'AUD'];
    for (let i = 0; i < count; i++) {
      this.overdraftList.push({
        accountNumber: `ACC-${i + 1}`,
        accountName: `Account ${i + 1}`,
        currency: currencies[i % currencies.length],
        utilizedAmount: Math.random() < 0.3 ? null : Math.floor(Math.random() * 10000), // 30% chance to be null
        dueAmount: Math.random() < 0.3 ? null : Math.floor(Math.random() * 1000), // 30% chance to be null
        dueDate: Date.now().toString(),
      });
    }
  }

  paginateIDCsList(page: number, pageSize: number, status?: string, idcType?: string) {
    const filteredIDC = this.idcList;

    // if (status) {
    //   filteredIDC = filteredIDC.filter(item => item.status === status);
    // }

    // if (idcType) {
    //   filteredIDC = filteredIDC.filter(item => item.idcType === idcType);
    // }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedIDC = filteredIDC.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredIDC.length / pageSize);

    return {
      data: paginatedIDC,
      pagination: {
        totalSize: filteredIDC.length,
        totalPages,
        pageStart: page,
        pageSize,
      },
    };
  }

  private generateMockIDCList(count: number): void {
    for (let i = 0; i < count; i++) {
      this.idcList.push({
        idcNumber: `TF25103000${i}`,
        idcAmount: Math.random() < 0.3 ? null : Math.floor(Math.random() * 10000),
        dueDate: Date.now().toString(),
        idcDrawer: `Drawer ${i + 1}`,
        idcType: i % 2 === 0 ? 'DIS' : 'ABC',
        status: i % 2 === 0 ? 'Utilized' : 'Pending',
        idcCurrency: i % 2 === 0 ? 'EUR' : 'USD',
        idcTypeDescription: 'Test Description',
      });
    }
  }

  getLookupTypes(listId: string) {
    return FACILITIES_TYPES_DATA;
  }

  getLCsDetails(lcNumber: string) {
    return LCsDetails;
  }

  getLGsDetails(lgNumber: string) {
    return LGsDetails;
  }

  getIDCDetails(idcNumber: string) {
    return IDCDetails;
  }

  getCreditCard(page: number, pageSize: number) {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedLoans = this.ccList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.ccList.length / pageSize);

    return {
      ccList: paginatedLoans,
      pagination: {
        pageStart: page,
        totalSize: this.ccList.length,
        pageSize,
        totalPages,
      },
    } satisfies CcListResponse;
  }

  private generateMockCcList(count: number): void {
    for (let i = 0; i < count; i++) {
      this.ccList.push({
        ccNumber: `524815******580${i}`,
        holderName: `TEST CARD ${i}`,
        availableToUse: Math.random() < 0.3 ? null : +(Math.random() * 10000).toFixed(2), // 30% chance to be null
        utilizedAmount: Math.random() < 0.3 ? null : +(Math.random() * 1000).toFixed(2), // 30% chance to be null
        dueAmount: Math.random() < 0.3 ? null : +(Math.random() * 1000).toFixed(2), // 30% chance to be null
        dueDate: Date.now().toString(),
        currency: i % 2 === 0 ? 'EGB' : 'USD',
        creditCardNumber: '5248150400395806',
      });
    }
  }

  private generateMockCcTransactions(count: number): void {
    for (let i = 0; i < count; i++) {
      this.ccTransactions.push({
        accountId: 9007199254740991,
        transactionDate: (Date.now() - 24 * 60 * 60 * 1000 * i).toString(),
        transactionType: 'TRANSFER',
        transactionCategory: `string ${i}`,
        transactionCode: `string ${i}`,
        description: `TEST CARD ${i}`,
        referenceNumber: `782VKDV25092a9U`,
        debitAmount: +(Math.random() * 10000).toFixed(2),
        creditAmount: +(Math.random() * 1000).toFixed(2),
        status: i % 2 === 0 ? 'settled' : 'pending',
        currencyId: 'EGB',
        balanceAfter: 0,
      });
    }
  }

  getCreditCardTransactions(page: number, pageSize: number): CcTransactionResponse {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedLoans = this.ccTransactions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.ccTransactions.length / pageSize);

    return {
      transactions: paginatedLoans,
      pagination: {
        pageStart: page,
        totalSize: this.ccTransactions.length,
        pageSize,
        totalPages,
      },
    } satisfies CcTransactionResponse;
  }

  getCreditCardDetails(ccNumber: string) {
    return {
      cardLimit: +(Math.random() * 10000).toFixed(2),
      availableBalance: +(Math.random() * 10000).toFixed(2),
      utilizedAmount: +(Math.random() * 10000).toFixed(2),
      heldAmount: +(Math.random() * 10000).toFixed(2),
      dueAmount: +(Math.random() * 10000).toFixed(2),
      dueDate: Date.now().toString(),
      currency: 'EGP',
      cardNumber: '****1239',
      expiryDate: '2032-08-24',
      cardholderName: 'TEST CARD',
      companyName: 'SCB',
    } satisfies CreditCardDetails;
  }
}
