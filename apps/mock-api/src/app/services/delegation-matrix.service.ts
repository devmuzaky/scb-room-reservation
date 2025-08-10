import { Injectable } from '@nestjs/common';
import { AllDelegation, DelegationQuery, DelegationResponse } from '../models/delegation-matrix.model';

@Injectable()
export class DelegationMatrixService {
  private allDelegationList: AllDelegation[] = [];

  constructor() {
    this.generateMockAllDelegationList(100);
  }

  private generateMockAllDelegationList(count: number): {
    requestDate: string;
    requestType: string;
    requestNumber: number;
    amount: string;
    status: string;
  }[] {
    const requestTypes = ['Inside', 'Between', 'Outside'];
    const statusLabels = ['Withdraw', 'Pending', 'Rejected'];

    this.allDelegationList = [];
    for (let i = 0; i < count; i++) {
      const randomAmount = (Math.floor(Math.random() * 9000) + 1000).toString();
      const randomId = Math.floor(Math.random() * 10) + 1000;

      this.allDelegationList.push({
        id: randomId,
        requestDate: this.getRandomDate(),
        requestType: requestTypes[Math.floor(Math.random() * requestTypes.length)],
        requestNumber: 100000 + i,
        amount: randomAmount,
        status: statusLabels[Math.floor(Math.random() * statusLabels.length)],
        currency: 'EGP',
      });
    }

    return this.allDelegationList;
  }

  public getDelegationList(query: DelegationQuery): DelegationResponse {
    let filtered = [...this.allDelegationList];

    if (query.status && query.status.length > 0) {
      filtered = filtered.filter(request => query.status?.includes(request.status));
    }

    const totalSize = filtered.length;
    const totalPages = Math.ceil(totalSize / query.pageSize);
    const paginatedData = filtered.slice(query.pageStart, query.pageStart + query.pageSize);

    return {
      list: paginatedData,
      pagination: {
        pageStart: query.pageStart,
        totalSize,
        pageSize: query.pageSize,
        totalPages,
      },
    };
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private getRandomDate(): string {
    const start = new Date(2024, 0, 1).getTime();
    const end = new Date(2026, 0, 1).getTime();
    const randomTime = start + Math.random() * (end - start);
    return this.formatDate(new Date(randomTime));
  }
}
