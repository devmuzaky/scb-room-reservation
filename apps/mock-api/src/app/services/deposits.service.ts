import { readFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { PDFResponse } from '../models/accounts-list';
import { MOCK_CERTIFICATES_DETAILS_RESPONSE } from '../models/certificates.mock';
import { TimeDeposit, TimeDepositsResponse } from '../models/time-deposits';
import { MOCK_TIME_DEPOSITS_DETAILS_RESPONSE } from '../models/time-deposits.mock';
import { CertificateList } from '../types/dashboard.types';

@Injectable()
export class DepositsService {
  private certificates: CertificateList[] = [];
  private timeDeposits: TimeDeposit[] = [];
  constructor() {
    this.generateMockCertificates(100);
    this.generateMockTimeDeposits(50);
  }

  getCertificates(username: string, currency: string, page: string, size: string) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(size, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return { error: 'Invalid page or pageSize' };
    }

    return this.paginateCertificates(pageNumber, pageSizeNumber, currency);
  }

  getTimeDeposits(username: string, currency: string, page: number, size: number) {
    if (isNaN(page) || isNaN(size)) {
      return { error: 'Invalid page or pageSize' };
    }

    return this.paginateTimeDeposits(page, size, currency);
  }

  getTimeDepositsDetails(tdNumber: string, username: string, currency: string, page: string, size: string) {
    if (tdNumber.startsWith('TD')) return MOCK_TIME_DEPOSITS_DETAILS_RESPONSE;
    else return MOCK_CERTIFICATES_DETAILS_RESPONSE;
  }

  getTimeDepositsPDF(username: string, format: string, currency: string, page: string, size: string) {
    return { file: PDFResponse };
  }

  paginateCertificates(page: number, pageSize: number, currencies: string) {
    let filteredCertificates = this.certificates;

    if (currencies) {
      const currencyList = currencies.split(',').map(currency => currency.trim());
      filteredCertificates = this.certificates.filter(account => currencyList.includes(account.currency));
    }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedAccounts = filteredCertificates.slice(startIndex, endIndex);

    // const totalBalance = filteredCertificates.reduce((sum, account) => sum + account.availableBalance, 0);

    const totalPages = Math.ceil(filteredCertificates.length / pageSize);

    return {
      lastUpdatedTimestamp: Date.now(),
      totalPages: totalPages,
      totalRecords: filteredCertificates.length,
      certificateListDos: paginatedAccounts,
    };
  }

  private generateMockCertificates(count: number): void {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'EGP', 'AUD'];
    for (let i = 0; i < count; i++) {
      this.certificates.push({
        CdNumber: `CD-1234-1232-3231-3231${i}`,
        type: `3-Year EGP Floating Certificate of Deposit ${i + 1}`,
        amount: Math.floor(Math.random() * 10000),
        interestRate: (Math.random() * (10 - 1) + 1).toFixed(2) + '%',
        maturityDate: Date.now().toString(),
        currency: currencies[i % currencies.length],
      });
    }
    const currencyOrder = ['EGP', 'USD', 'EUR', 'GBP'];
    this.certificates.sort((a, b) => {
      const indexA = currencyOrder.indexOf(a.currency);
      const indexB = currencyOrder.indexOf(b.currency);
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      const currencyComparison = a.currency.localeCompare(b.currency);
      return currencyComparison;
    });
  }

  paginateTimeDeposits(page: number, pageSize: number, currency?: string): TimeDepositsResponse {
    let filteredDeposits = this.timeDeposits;

    if (currency) {
      const currencies = currency.split(',').map(c => c.trim());
      filteredDeposits = this.timeDeposits.filter(deposit => currencies.includes(deposit.currency));
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedTimeDeposits = filteredDeposits.slice(startIndex, endIndex);

    const totalBalance = filteredDeposits.reduce((sum, deposit) => sum + deposit.tdAmount, 0);

    const totalPages = Math.ceil(filteredDeposits.length / pageSize);

    return {
      totalAmount: totalBalance,
      totalPages: totalPages,
      totalSize: filteredDeposits.length,
      lastUpdated: new Date().toISOString(),
      tdList: paginatedTimeDeposits,
    };
  }

  private generateMockTimeDeposits(count: number): void {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'EGP', 'AUD'];
    const tenors = ['3 Months', '6 Months', '12 Months', '24 Months'];
    for (let i = 0; i < count; i++) {
      this.timeDeposits.push({
        tdNumber: `TD${(i + 1).toString().padStart(4, '0')}`,
        tdType: 'Term Deposit',
        tdAmount: Math.floor(Math.random() * 100000) + 10000,
        currency: currencies[i % currencies.length],
        interestRate: Math.random() * 5 + 1,
        maturityDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tenor: tenors[i % tenors.length],
        interestFrequency: '-',
      });
    }
  }

  async tnc() {
    const data = await readFile(process.cwd() + '/apps/mock-api/src/app/services/tnc.pdf');
    return {
      status: 'success',
      pdfBase64: data.toString('base64'),
    };
  }
}
