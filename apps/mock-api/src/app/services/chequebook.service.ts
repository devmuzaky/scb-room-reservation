import { Injectable } from '@nestjs/common';
import {
  ChequebookApiResponse,
  ChequeBookQuery,
  ChequeBookRequest,
  LinkedAccountDTO,
  LinkedAccountListResponseDTO,
} from '../models/chequebook.model';

@Injectable()
export class ChequeBookService {
  private chequeBookRequests: ChequeBookRequest[] = [];
  private linkedAccount: LinkedAccountDTO[] = [];

  constructor() {
    this.generateMockChequeBookRequests(10);
    this.generateMockAccounts(10);
  }

  public generateMockChequeBookRequests(count: number): ChequeBookRequest[] {
    const nicknames = ['John Doe', 'Alice Smith', 'شركة السلام', 'Ahmed 7amada', 'Tech Corp'];
    const statusLabels: string[] = ['Under Reviewing', 'Approved', 'Printed', 'At Branch Side', 'Received'];

    const currencies = ['EGP', 'USD'];
    const accountTypes = ['Current', 'Saving'];

    this.chequeBookRequests = [];

    for (let i = 0; i < count; i++) {
      this.chequeBookRequests.push({
        accountNickname: `${nicknames[Math.floor(Math.random() * nicknames.length)]} ${Math.floor(1000 + Math.random() * 9000)}`,
        accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
        accountNumber: `0130${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        accountCurrency: currencies[Math.floor(Math.random() * currencies.length)],
        chequebooksIssued: Math.floor(Math.random() * 5) + 1,
        leavesCount: Math.floor(Math.random() * 5) + 1,
        status: statusLabels[Math.floor(Math.random() * statusLabels.length)],
        cifBranch: `Branch-${Math.floor(Math.random() * 100)}`,
        issueFee: Math.floor(Math.random() * 100),
        requestDate: this.getRandomDate(),
      });
    }

    return this.chequeBookRequests;
  }

  public getChequeBookRequestsList(query: ChequeBookQuery): ChequebookApiResponse {
    let filtered = [...this.chequeBookRequests];

    if (query.status && query.status.length > 0) {
      filtered = filtered.filter(request => query.status?.includes(request.status));
    }

    const totalSize = filtered.length;
    const totalPages = Math.ceil(totalSize / query.pageSize);
    const paginatedData = filtered.slice(query.pageStart, query.pageStart + query.pageSize);

    return {
      chequebooks: paginatedData,
      lastUpdated: new Date().toISOString(),
      pagination: {
        pageStart: query.pageStart,
        pageToken: `${Date.now()},${query.pageSize}`,
        totalSize,
        pageSize: query.pageSize,
        totalPages,
      },
    };
  }

  getLinkedAccountsList(pageStart: number, pageSize: number): LinkedAccountListResponseDTO {
    const egpAccounts = this.linkedAccount.filter(account => account.currency === 'EGP');
    const paginatedAccounts = egpAccounts.slice(pageStart * pageSize, (pageStart + 1) * pageSize);

    return {
      accounts: paginatedAccounts,
      pagination: {
        totalSize: egpAccounts.length,
        pageStart,
        pageSize,
        totalPages: Math.ceil(egpAccounts.length / pageSize),
      },
    };
  }

  private generateMockAccounts(count: number): void {
    const accountTypes = ['Savings', 'Checking', 'Investment'];
    const currencies = ['USD', 'EUR', 'GBP', 'EGP'];

    for (let i = 0; i < count; i++) {
      const account: LinkedAccountDTO = {
        nickname: `Account ${i + 1}`,
        categoryDescription: accountTypes[Math.floor(Math.random() * accountTypes.length)],
        accountNumber: `ACC${Math.floor(100000 + Math.random() * 900000)}`,
        workingBalance: Math.floor(Math.random() * 1000000) / 100,
        currency: currencies[Math.floor(Math.random() * currencies.length)],
      };
      this.linkedAccount.push(
        ...[
          {
            nickname: 'ALUMINUM  INDUSTRY OVD',
            categoryDescription: 'Current Accounts',
            accountNumber: '01303432101001',
            workingBalance: 950206564.16,
            currency: 'EGP',
            OVD: true,
          },
          {
            nickname: 'ايجيبت احمد يوسف',
            categoryDescription: 'Current Accounts',
            accountNumber: '0130343210100101',
            workingBalance: 88289785.11,
            currency: 'EGP',
            OVD: false,
          },
          {
            nickname: 'OVD شركه هارتمان ايجيبت',
            categoryDescription: 'Current Accounts',
            accountNumber: '0130343210100102',
            workingBalance: -4074463.52,
            currency: 'EGP',
            OVD: true,
          },
        ],
      );
      this.linkedAccount.push(account);
    }
  }

  public getTermsAndConditions(lang: string) {
    const termsData = {
      ar: `أتعهد بألا أفصح عن أي بيانات شخصية أو بيانات تجارية أو أي بيانات مستخدمة في هذا التطبيق بشكل مباشر أو غير مباشر وفقًا لأحكام المادة 4 من قانون البنك المركزي المصري والجهاز المصرفي رقم 88 لسنة 2003 ولائحته التنفيذية وتعديلاته. يظل هذا التعهد ساري المفعول ونافذًا حتى بعد التوقف عن استخدام هذا التطبيق.

أتعهد باستخدام هذا التطبيق ببياناتي الشخصية أو بيانات شركتي أو مؤسستي، وأقر بأنه لا يحق لي تفويض أي شخص آخر لاستخدام هذا التطبيق، وفي حالة مخالفة ذلك، يخلي بنك قناة السويس مسؤوليته عن أي أضرار قد تنشأ نتيجة هذا التصرف.

أتحمل كامل المسؤولية عن رقم الهاتف المحمول الذي قمت بإدخاله في هذا التطبيق، وفي حال فقدانه أو سرقته أو تغييره، أتحمل المسؤولية الكاملة عن أي إساءة استخدام لهذا الرقم من قبل أي طرف ثالث. وأقر بأن بنك قناة السويس غير مسؤول عن أي محاولات من قبل الآخرين للوصول إلى هذا التطبيق.

أتحمل كامل المسؤولية عن رقم الهاتف المحمول الذي قمت بإدخاله في هذا التطبيق، وفي حال فقدانه أو سرقته أو تغييره، أتحمل المسؤولية الكاملة عن أي إساءة استخدام لهذا الرقم من قبل أي طرف ثالث. وأقر بأن بنك قناة السويس غير مسؤول عن أي محاولات من قبل الآخرين للوصول إلى هذا التطبيق.`,

      en: `I undertake that I shall not disclose any personal data, business data, or any data used in this application directly or indirectly according to the provisions of Section 4 of Central Bank of Egypt and Banking Sectors Law No.88 of 2003, its executive regulation, and its amendments. This undertaking shall be valid and effective even after ending the use of such application.

I shall use this application with my personal data, company, or enterprise data and I acknowledge that I am not allowed to authorize any other person to use this application. Otherwise, Suez Canal Bank shall have no liability in case of any damage arising from this action.

I am fully responsible for the Mobile number I have inserted into this application and if this number is lost, stolen, or changed, I shall be liable for any misuse of such number by any third party. I acknowledge that Suez Canal Bank shall not be responsible for any attempts by others to access this application.

I am fully responsible for the Mobile number I have inserted into this application and if this number is lost, stolen, or changed, I shall be liable for any misuse of such number by any third party. I acknowledge that Suez Canal Bank shall not be responsible for any attempts by others to access this application.`,
    };

    return {
      language: lang,
      terms: termsData[lang] || termsData['en'],
    };
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private getRandomDate(): string {
    const start = new Date(2024, 0, 1).getTime();
    const end = new Date(2026, 0, 1).getTime();
    const randomTime = start + Math.random() * (end - start);
    return this.formatDate(new Date(randomTime));
  }

  calculateFee(numberOfChequebooks: number, numberOfLeaves: number) {
    const feePerBook = 10;
    const feePerLeaf = 0.5;

    const totalFee = numberOfChequebooks * feePerBook + numberOfLeaves * feePerLeaf;

    return {
      feeAmount: totalFee,
      currency: 'EGP',
    };
  }
  getBranchInfo(accountNumber: number) {
    return BRANCH_DETAILS;
  }

  getChequeBookDetails() {
    return CHEQUEBOOK_DETAILS;
  }
}

export const BRANCH_DETAILS = {
  name: 'Main Branch',
};

export const CHEQUEBOOK_DETAILS = {
  accountNickname: 'حكيم يوسف العفيفي',
  accountType: 'CURRENT.ACCOUNT',
  accountNumber: '1320003120100101',
  accountCurrency: 'USD',
  chequebooksIssued: 3,
  leavesCount: 50,
  status: 'RECEIVED',
  cifBranch: 'Garden City.جاردن سيتي',
  issueFee: 1500.0,
  requestDate: '2020-11-05',
  statusHistory: [
    {
      status: 'UNDER_REVIEW',
      date: '2020-11-05',
    },
    {
      status: 'APPROVED',
      date: '2020-11-05',
    },
    // {
    //   status: 'PRINTING',
    //   date: '2020-11-11',
    // },
    // {
    //   status: 'AT_BRANCH',
    //   date: '2020-11-08',
    // },
    // {
    //   status: 'RECEIVED',
    //   date: '2020-11-11',
    // },
  ],
};
