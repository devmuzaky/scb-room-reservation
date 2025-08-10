import { Injectable } from '@nestjs/common';
import { CSVResponse, PDFResponse } from '../models/accounts-list';
import { UpcomingDuesList } from '../models/dashboard';
import { LoanRepayment } from '../models/facilities-detail';

@Injectable()
export class PaymentsService {
  private overdraftUpcomingList: UpcomingDuesList[] = [];
  private loanRepaymentList: LoanRepayment[] = [];

  constructor() {
    this.generateMockUpcomingList(100);
    this.generateMockRepaymentList(100);
  }

  paginateUpcomingList(accountNumber: string, fromDate: string, toDate: string, page: string, size: string) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(size, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return { error: 'Invalid page or pageSize' };
    }

    const filteredUpcoming = this.overdraftUpcomingList;

    const startIndex = pageNumber * pageSizeNumber;
    const endIndex = startIndex + pageSizeNumber;

    const paginatedUpcoming = filteredUpcoming.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUpcoming.length / pageSizeNumber);

    return {
      upcomingDues: paginatedUpcoming,
      pagination: {
        totalSize: filteredUpcoming.length,
        totalPages,
        pageStart: page,
        pageSize: pageSizeNumber,
      },
    };
  }

  paginateRepaymentsList(account: string, status: string, page: string, size: string) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(size, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return { error: 'Invalid page or pageSize' };
    }

    const filteredRepayment = this.loanRepaymentList;

    const startIndex = pageNumber * pageSizeNumber;
    const endIndex = startIndex + pageSizeNumber;

    const paginatedRepayment = filteredRepayment.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredRepayment.length / pageSizeNumber);

    return {
      loansList: paginatedRepayment,
      pagination: {
        totalSize: filteredRepayment.length,
        totalPages,
        pageStart: pageNumber,
        pageSize: pageSizeNumber,
      },
    };
  }

  downloadFileUpcomingList(accountNumber: string, format: string) {
    if (format === 'pdf') return { file: PDFResponse };
    else return { file: CSVResponse };
  }

  private generateMockUpcomingList(count: number): void {
    for (let i = 0; i < count; i++) {
      this.overdraftUpcomingList.push({
        transactionDate: new Date().toISOString().split('T')[0],
        referenceNumber: Math.random() > 0.5 ? `REF${i}${Date.now()}` : null,
        remainingAmount: Math.random() > 0.5 ? +(Math.random() * 10000).toFixed(2) : null,
        dueAmount: +(Math.random() * 10000).toFixed(2),
        currency: Math.random() > 0.3 ? (i % 2 === 0 ? 'EUR' : 'USD') : null,
        dueDate: new Date(Date.now() + i * 86400000).toISOString().split('T')[0], // adds i days
      });
    }
  }

  private generateMockRepaymentList(count: number): void {
    const statuses = ['Others', 'Pending', 'Paid'];
    // const statuses = ['أخري', 'لم يستحق', 'مدفوع'];

    const currencies = ['EUR', 'USD'];
    for (let i = 0; i < count; i++) {
      this.loanRepaymentList.push({
        installmentAmount: +(Math.random() * 10000).toFixed(2),
        installmentDate: Date.now().toString(),
        status: statuses[i % statuses.length],
        currency: currencies[i % currencies.length],
      });
    }
  }
}
