import { Observable, of } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { TRANSFER_DATA_AR, TRANSFER_DATA_EN } from '../constants/transfer.constant';
import { EXCHANGE_RATE } from '../models/dashboard';
import { TransferDetailsDTO } from '../models/transfer-details.model';
import {
  AccountDTO,
  AccountListResponseDTO,
  CharityCategoriesResponseDTO,
  CharityCategoryDTO,
  CharityDTO,
  CharityListResponseDTO,
  ReasonListResponse,
  RecurringTransferRequestDTO,
  RecurringTransferResponseDTO,
  ScheduledTransfer,
  TransferDataResponse,
  TransferHistoryItem,
  TransferHistoryQuery,
  TransferHistoryResponse,
  TransferRequestDTO,
  TransferResponseDTO,
  TransfersResponse,
  TransferStatus,
  TransferType,
} from '../models/transfers.models';

@Injectable()
export class TransferService {
  private transferAccount: AccountDTO[] = [];
  private transferHistory: TransferHistoryItem[] = [];
  private scheduledTransfers: ScheduledTransfer[] = [];
  private charities: CharityDTO[] = [];
  private charityCategories: Map<string, CharityCategoryDTO[]> = new Map();

  constructor() {
    this.generateMockAccounts(100);
    this.generateMockTransferHistory(500);
    this.generateMockScheduledTransfers(50);
    this.generateMockCharities();
    this.generateMockCharityCategories();
  }

  private generateMockCharities(): void {
    const charityNames = [
      { en: 'Red Crescent Society', ar: 'جمعية الهلال الأحمر', icon: '777' },
      { en: 'Cancer Foundation', ar: 'مؤسسة مكافحة السرطان', icon: '37037' },
      { en: 'Children Hospital Foundation', ar: 'مؤسسة مستشفى الأطفال', icon: '44444' },
      { en: 'Education for All', ar: 'التعليم للجميع', icon: '55555' },
      { en: 'Food Bank Egypt', ar: 'بنك الطعام المصري', icon: '90000' },
      { en: 'Orphan Care Foundation', ar: 'مؤسسة رعاية الأيتام', icon: '333333' },
      { en: 'Elderly Care Society', ar: 'جمعية رعاية المسنين', icon: '555777' },
      { en: 'Emergency Relief Fund', ar: 'صندوق الإغاثة الطارئة', icon: '780780' },
      { en: 'Clean Water Initiative', ar: 'مبادرة المياه النظيفة', icon: '901006' },
      { en: 'Disability Support Center', ar: 'مركز دعم ذوي الاحتياجات الخاصة', icon: '1077779' },
      { en: 'Womens Empowerment Foundation', ar: 'مؤسسة تمكين المرأة', icon: '1088881' },
      { en: 'Youth Development Society', ar: 'جمعية تنمية الشباب', icon: '1305088' },
      { en: 'Environmental Protection Fund', ar: 'صندوق حماية البيئة', icon: '10001000' },
      { en: 'Healthcare Access Foundation', ar: 'مؤسسة إتاحة الرعاية الصحية', icon: '11301852' },
      { en: 'Literacy Program Egypt', ar: 'برنامج محو الأمية مصر', icon: '81300374' },
    ];

    this.charities = charityNames.map((charity, index) => ({
      customerId: charity.icon,
      customerNameEN: charity.en,
      customerNameAR: charity.ar,
    }));
  }

  private generateMockCharityCategories(): void {
    const categoryTemplates = [
      { en: 'Emergency Relief', ar: 'الإغاثة الطارئة' },
      { en: 'Healthcare Services', ar: 'الخدمات الصحية' },
      { en: 'Education Support', ar: 'دعم التعليم' },
      { en: 'Food Assistance', ar: 'المساعدات الغذائية' },
      { en: 'Shelter Program', ar: 'برنامج الإيواء' },
      { en: 'Child Care', ar: 'رعاية الأطفال' },
      { en: 'Elderly Support', ar: 'دعم المسنين' },
      { en: 'Disability Services', ar: 'خدمات ذوي الاحتياجات الخاصة' },
      { en: 'Community Development', ar: 'تنمية المجتمع' },
      { en: 'Environmental Conservation', ar: 'المحافظة على البيئة' },
    ];

    this.charities.forEach(charity => {
      const numCategories = Math.floor(Math.random() * 5) + 3;
      const categories: CharityCategoryDTO[] = [];

      const shuffledCategories = [...categoryTemplates].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numCategories; i++) {
        const category = shuffledCategories[i];
        categories.push({
          accountId: `${charity.customerId}_CAT_${(i + 1).toString().padStart(2, '0')}`,
          accountTitleEN: category.en,
          accountTitleAR: category.ar,
        });
      }

      this.charityCategories.set(charity.customerId, categories);
    });
  }

  private generateMockAccounts(count: number): void {
    const accountTypes = ['Savings', 'Checking', 'Investment'];
    const currencies = ['USD', 'EUR', 'GBP', 'EGP'];

    for (let i = 0; i < count; i++) {
      const account: AccountDTO = {
        nickname: `Account ${i + 1}`,
        accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
        accountNumber: `ACC${Math.floor(100000 + Math.random() * 900000)}`,
        availableBalance: Math.floor(Math.random() * 1000000) / 100,
        currency: currencies[Math.floor(Math.random() * currencies.length)],
      };
      this.transferAccount.push(
        ...[
          {
            nickname: 'HARTMAN EGYPT CO. FOR ALUMINUM  INDUSTRY',
            accountType: 'Current Accounts',
            accountNumber: '01303432101001',
            availableBalance: 950206564.16,
            currency: 'EGP',
          },
          {
            nickname: 'شركه هارتمان ايجيبت احمد يوسف',
            accountType: 'Current Accounts',
            accountNumber: '0130343210100101',
            availableBalance: 88289785.11,
            currency: 'EGP',
          },
          {
            nickname: 'شركه هارتمان ايجيبت',
            accountType: 'Current Accounts',
            accountNumber: '0130343210100102',
            availableBalance: -4074463.52,
            currency: 'EGP',
          },
        ],
      );
      this.transferAccount.push(account);
    }
  }

  private generateMockTransferHistory(count: number): void {
    const transferTypes: TransferType[] = ['OWN', 'INSIDE', 'OUTSIDE', 'CHARITY'];
    const transferStatuses: TransferStatus[] = ['SUCCESS', 'PENDING', 'FAILED'];
    const currencies = ['EGP', 'USD', 'EUR', 'GBP'];
    const beneficiaryNames = [
      'Ahmed Ali',
      'Mohammed Ali',
      'Sara Ahmed',
      'Fatma Hassan',
      'Omar Khaled',
      'Mona Ibrahim',
      'Red Crescent Society',
      'Cancer Foundation',
      'Children Hospital Foundation',
      'Food Bank Egypt',
      'Khaled Mahmoud',
      'Nour El-Din',
      'Yasmine Samir',
      'Hassan Mohamed',
      'Laila Mostafa',
      'Tarek Nabil',
      'Amr Hassan',
      'Dina Saeed',
      'Hany Mostafa',
      'Rania Kamel',
      'Sherif Adel',
      'Noha Gamal',
      'Tamer Farouk',
      'Mariam Salah',
      'Youssef Nabil',
      'Heba Ramadan',
      'Waleed Samy',
      'Nesma Fouad',
      'Bassem Magdy',
      'Salma Hesham',
      'Karim Zaki',
      'Mai Ashraf',
      'Hazem Shawky',
      'Rana Emad',
      'Mostafa Amin',
      'Nada Samir',
    ];

    const today = new Date();

    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 1095);
      const transactionDate = new Date(today);
      transactionDate.setDate(today.getDate() - daysAgo);

      const transferType = transferTypes[Math.floor(Math.random() * transferTypes.length)];
      let transferAmount: number;
      let transferCurrency: string;

      if (transferType === 'OWN') {
        transferAmount = Math.floor(Math.random() * 50000) + 1000;
        transferCurrency = currencies[Math.floor(Math.random() * currencies.length)];
      } else if (transferType === 'INSIDE') {
        transferAmount = Math.floor(Math.random() * 20000) + 100;
        transferCurrency = Math.random() > 0.8 ? 'USD' : 'EGP';
      } else if (transferType === 'CHARITY') {
        transferAmount = Math.floor(Math.random() * 10000) + 100;
      } else {
        transferAmount = Math.floor(Math.random() * 100000) + 500;
        transferCurrency = Math.random() > 0.7 ? currencies[Math.floor(Math.random() * currencies.length)] : 'EGP';
      }

      let transferStatus: TransferStatus;
      const statusRandom = Math.random();
      if (statusRandom > 0.85) {
        transferStatus = 'FAILED';
      } else if (statusRandom > 0.7) {
        transferStatus = 'PENDING';
      } else {
        transferStatus = 'SUCCESS';
      }

      const transaction: TransferHistoryItem = {
        transferId: this.generateUUID(),
        transactionDate: this.formatDate(transactionDate),
        referenceNumber: this.generateReferenceNumber(),
        debitedAccount: this.generateAccountNumber(),
        beneficiaryName: beneficiaryNames[Math.floor(Math.random() * beneficiaryNames.length)],
        transferType: transferType,
        transferAmount: transferAmount / 100,
        transferCurrency: transferCurrency,
        transferStatus: transferStatus,
        isRecurring: transferType !== 'CHARITY' && Math.random() > 0.85,
      };
      this.transferHistory.push(transaction);
    }

    this.transferHistory.sort((a, b) => {
      const dateA = this.parseDate(a.transactionDate);
      const dateB = this.parseDate(b.transactionDate);
      return dateB.getTime() - dateA.getTime();
    });
  }

  public generateMockScheduledTransfers(count: number, pageStart = 0, pageSize = 10): TransfersResponse {
    const beneficiaries = ['John Doe', 'شركة السلام', 'Alice Smith', '7amada 2', 'Tech Corp'];
    const currencies = ['USD', 'EUR', 'GBP', 'EGP'];
    const transferTypes = ['OWN', 'INSIDE', 'OUTSIDE'];
    const frequencyTypes = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'];

    this.scheduledTransfers = []; // reset before generating new ones ✅

    for (let i = 0; i < count; i++) {
      this.scheduledTransfers.push({
        scheduleId: crypto.randomUUID(),
        beneficiaryName: beneficiaries[Math.floor(Math.random() * beneficiaries.length)],
        transferAmount: parseFloat((Math.random() * 10000).toFixed(2)),
        transferCurrency: currencies[Math.floor(Math.random() * currencies.length)],
        executionDate: this.getRandomDate(),
        nextExecutionDate: Math.random() > 0.5 ? this.getRandomDate() : null,
        transferType: transferTypes[Math.floor(Math.random() * transferTypes.length)],
        frequencyType: frequencyTypes[Math.floor(Math.random() * frequencyTypes.length)],
        totalTransferCount: Math.floor(Math.random() * 10) + 1,
        executedTransferCount: Math.floor(Math.random() * 5),
      });
    }

    const paginatedData = this.scheduledTransfers.slice(0, 100);

    return {
      lastUpdatedTimestamp: new Date().toISOString(),
      transferList: paginatedData,
      pagination: {
        pageStart,
        totalSize: this.scheduledTransfers.length,
        pageSize,
        totalPages: Math.ceil(this.scheduledTransfers.length / pageSize),
      },
    };
  }

  getCharityList(): CharityListResponseDTO {
    return {
      charityList: this.charities,
    };
  }

  getCharityCategories(customerId: string): CharityCategoriesResponseDTO {
    const categories = this.charityCategories.get(customerId) || [];
    return {
      accounts: categories,
    };
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private generateReferenceNumber(): string {
    const prefix = 'FT';
    const year = new Date().getFullYear().toString().substr(-2);
    const dayOfYear = Math.floor(Math.random() * 365) + 1;
    const random = this.generateRandomString(5);
    return `${prefix}${year}${dayOfYear.toString().padStart(3, '0')}${random}`;
  }

  private generateAccountNumber(): string {
    const prefix = '0130';
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomDigits}`;
  }

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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
    return this.formatDate(new Date(randomTime)); // ✅ reuse your existing method
  }

  getFromAccountsList(currency: string, pageStart: number, pageSize: number): AccountListResponseDTO {
    const filteredAccounts = currency
      ? this.transferAccount.filter(account => account.currency === currency)
      : this.transferAccount;

    const paginatedAccounts = filteredAccounts.slice(pageStart * pageSize, (pageStart + 1) * pageSize);

    return {
      data: paginatedAccounts,
      pagination: {
        totalSize: filteredAccounts.length,
        pageStart,
        pageSize,
        totalPages: Math.ceil(filteredAccounts.length / pageSize),
      },
    };
  }

  getToAccountsList(pageStart: number, pageSize: number): AccountListResponseDTO {
    const egpAccounts = this.transferAccount.filter(account => account.currency === 'EGP');
    const paginatedAccounts = egpAccounts.slice(pageStart * pageSize, (pageStart + 1) * pageSize);

    return {
      data: paginatedAccounts,
      pagination: {
        totalSize: egpAccounts.length,
        pageStart,
        pageSize,
        totalPages: Math.ceil(egpAccounts.length / pageSize),
      },
    };
  }

  getReasons(): ReasonListResponse {
    return {
      data: [
        {
          reasonAr: 'اقساط',
          reasonEn: 'Installment',
        },
        {
          reasonAr: 'بطاقة ائتمان',
          reasonEn: 'Credit Card',
        },
        {
          reasonAr: 'أخرى',
          reasonEn: 'Others',
        },
        {
          reasonAr: 'مرتبات',
          reasonEn: 'Payroll',
        },
        {
          reasonAr: 'موردين',
          reasonEn: 'Supplier Payment',
        },
        {
          reasonAr: 'خيري',
          reasonEn: 'Charity',
        },
      ],
    };
  }

  getTransferData(lang: string): TransferDataResponse {
    return lang?.toLocaleLowerCase() === 'ar' ? TRANSFER_DATA_AR : TRANSFER_DATA_EN;
  }

  calculateRecurringTransfer(body: RecurringTransferRequestDTO): RecurringTransferResponseDTO {
    const { transferDate, frequency, numberOfTransfers, endDate } = body;

    // Parse the start date from DD-MM-YYYY format
    const [startDay, startMonth, startYear] = transferDate.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);

    // Parse the end date from DD-MM-YYYY format
    const [endDay, endMonth, endYear] = endDate.split('-').map(Number);
    const endDateObj = new Date(endYear, endMonth - 1, endDay);

    const dates: string[] = [];
    const currentDate = new Date(startDate);
    let count = 0;

    while (currentDate <= endDateObj && count < numberOfTransfers) {
      // Format the date as DD-MM-YYYY
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
      dates.push(formattedDate);
      count++;

      // Calculate next date based on frequency
      switch (frequency) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'QUARTERLY':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case 'SEMI_ANNUALLY':
          currentDate.setMonth(currentDate.getMonth() + 6);
          break;
        case 'ANNUALLY':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        default:
          // For 'ONCE', we just return the single date
          return { data: [transferDate] };
      }
    }

    return {
      data: dates,
    };
  }

  createTransfer(body: TransferRequestDTO): TransferResponseDTO {
    const newTransfer: TransferHistoryItem = {
      transferId: this.generateUUID(),
      transactionDate: this.formatDate(new Date()),
      referenceNumber: this.generateReferenceNumber(),
      debitedAccount: body.fromAccount.accountNumber,
      beneficiaryName:
        body.transferType === 'CHARITY'
          ? body.charityTransferDto?.charityName || 'Charity Organization'
          : body.toAccount?.accountNickname || 'Hamada',
      transferType: body.transferType,
      transferAmount: body.transferAmount,
      transferCurrency: body.transferCurrency,
      transferStatus: 'PENDING',
      isRecurring: body.transferType !== 'CHARITY' && body.isSchedule && body.scheduleDto?.frequencyType !== 'ONCE',
    };

    this.transferHistory.unshift(newTransfer);

    const baseResponse = {
      transferAmount: body.transferAmount,
      transferCurrency: body.transferCurrency,
      fromAccount: body.fromAccount,
      transferType: body.transferType,
      transferStatus: 'PENDING' as TransferStatus,
      description: body.description || '',
      valueDate: new Date().toISOString(),
      transactionDate: new Date().toISOString(),
      referenceId: newTransfer.referenceNumber,
      convertedAmount: body.transferAmount,
      exchangeRate: EXCHANGE_RATE.rates.find(x => x.currencyName === body.transferCurrency) || {
        currencyName: body.transferCurrency,
        buy: 1,
        sell: 1,
      },
      status: 'success',
    };

    if (body.transferType === 'CHARITY' && body.charityTransferDto) {
      return {
        ...baseResponse,
        charityTransferDto: body.charityTransferDto,
        toAccount: undefined,
        beneficiary: undefined,
        transferReason: 'Charity Donation',
        transferNetwork: undefined,
        chargeBearer: undefined,
        fees: undefined,
        feesCurrency: undefined,
        scheduleDto: undefined,
      };
    }

    return {
      ...baseResponse,
      toAccount: body.toAccount,
      charityTransferDto: undefined,
      scheduleDto: body.scheduleDto,
      beneficiary: {
        beneficiaryId: '2e228be1-dbf7-4153-bbb1-05f0c1152f30',
        beneficiaryName: 'tet',
        beneficiaryNickname: 'tetetete',
        beneficiaryType: 'LOCAL_OUTSIDE_SCB',
        bank: {
          code: 'COMMERCIAL_INTERNATIONAL_BANK',
          bankNameAr: 'البنك التجاري الدولي',
          bankNameEn: 'Commercial International Bank',
          length: null,
        },
        transactionMethod: 'IBAN',
        beneficiaryNumber: 'EG910010017900000100043033427',
      },
      transferReason: body.transferReason || 'Credit Card',
      transferNetwork: body.transferNetwork || 'ACH',
      chargeBearer: body.chargeBearer || 'SENDER',
      fees: 10,
      feesCurrency: 'EGP',
    };
  }

  getBeneficiaryList() {
    return {
      data: [
        {
          beneficiaryId: '1d6c6cf9-35c4-4adf-8012-dd2ed5f445a7',
          beneficiaryName: 'Hatem',
          beneficiaryNickname: 'toooma',
          beneficiaryType: 'INSIDE_SCB',
          bank: {
            code: 'SUEZ_CANAL_BANK',
            bankNameAr: 'بنك قناة السويس',
            bankNameEn: 'Suez Canal Bank',
            length: null,
          },
          transactionMethod: 'MOBILE_NUMBER',
          beneficiaryNumber: '01111121111',
        },
      ],
      pagination: {
        pageStart: 0,
        totalSize: 0,
        pageSize: 0,
        totalPages: 0,
      },
    };
  }

  getTransferHistory(query: TransferHistoryQuery): TransferHistoryResponse {
    let filteredHistory = [...this.transferHistory];

    if (query.transferType) {
      const types = query.transferType.split(',');
      filteredHistory = filteredHistory.filter(item => types.includes(item.transferType));
    }

    if (query.transferStatus) {
      const statuses = query.transferStatus.split(',');
      filteredHistory = filteredHistory.filter(item => statuses.includes(item.transferStatus));
    }

    if (query.fromDate && query.toDate) {
      const fromDate = this.parseDate(query.fromDate);
      const toDate = this.parseDate(query.toDate);

      filteredHistory = filteredHistory.filter(item => {
        const itemDate = this.parseDate(item.transactionDate);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    const totalSize = filteredHistory.length;
    const totalPages = Math.ceil(totalSize / query.pageSize);
    const paginatedHistory = filteredHistory.slice(
      query.pageStart * query.pageSize,
      (query.pageStart + 1) * query.pageSize,
    );

    return {
      lastUpdatedTimestamp: new Date().toISOString(),
      transferHistory: paginatedHistory,
      pagination: {
        pageStart: query.pageStart + 1,
        totalSize,
        pageSize: query.pageSize,
        totalPages,
      },
      status: 'success',
    };
  }

  getScheduledTransfersList(query: TransferHistoryQuery): TransfersResponse {
    let scheduledTransfers = [...this.scheduledTransfers];

    if (query.transferType) {
      const types = query.transferType.split(',');
      scheduledTransfers = scheduledTransfers.filter(item => types.includes(item.transferType));
    }

    if (query.fromDate && query.toDate) {
      const fromDate = this.parseDate(query.fromDate);
      const toDate = this.parseDate(query.toDate);

      scheduledTransfers = scheduledTransfers.filter(item => {
        const itemDate = this.parseDate(item.executionDate);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    const totalSize = scheduledTransfers.length;
    const totalPages = Math.ceil(totalSize / query.pageSize);
    const paginatedScheduledTransfers = scheduledTransfers.slice(0, 100);

    return {
      lastUpdatedTimestamp: new Date().toISOString(),
      transferList: paginatedScheduledTransfers,
      pagination: {
        pageStart: 0,
        totalSize,
        pageSize: 100,
        totalPages,
      },
    };
  }

  // moke data for transfer details
  getTransferDetails(): Observable<TransferDetailsDTO> {
    // You can return different data based on the ID if needed
    const mockData: TransferDetailsDTO = {
      transferAmount: 5000,
      transferCurrency: 'EGP',
      fromAccount: {
        accountNumber: '1234567890',
        accountNickname: 'Main Account',
        accountType: 'Savings',
      },
      toAccount: {
        accountNumber: '0987654321',
        accountNickname: 'Electricity',
        accountType: 'Checking',
      },
      transferType: 'OWN',
      transferStatus: 'COMPLETED',
      description: 'Mocked Transfer',
      valueDate: new Date().toISOString(),
      transactionDate: new Date().toISOString(),
      referenceId: `REF`,
      convertedAmount: 5000,
      exchangeRate: {
        currencyName: 'SAR',
        buy: 1,
        sell: 1,
      },
      beneficiary: {
        beneficiaryId: 'BENE123',
        beneficiaryName: 'Utility Company',
        beneficiaryNickname: 'Utilities',
        beneficiaryType: 'INSIDE_SCB',
        bank: {
          code: 'SCB01',
          bankNameAr: 'بنك ساب',
          bankNameEn: 'SCB',
          length: '24',
        },
        transactionMethod: 'BANK_ACCOUNT',
        beneficiaryNumber: '9999999999',
      },
      transferReason: 'Utility Payment',
      transferNetwork: 'ACH',
      chargeBearer: 'SENDER',
      fees: 10,
      feesCurrency: 'SAR',
      scheduleDto: {
        submitDate: '2025-06-01',
        endDate: '2025-12-01',
        numberOfTransfers: 10,
        frequencyType: 'MONTHLY',
      },
      status: 'SUCCESS',
      errors: [],
      transferId: `1`,
      scheduleId: '',
      scheduleStats: {
        numberOfSuccess: 5,
        numberOfPending: 2,
        numberOfFailed: 1,
        total: 8,
      },
      username: 'Muhammad Hassan',
      nextTransferDate: '2025-07-01',
      failureReason: 'due to insufficient funds',
    };

    return of(mockData);
  }

  getRecurringDetails() {
    return {
      transferAmount: 10,
      transferCurrency: 'EGP',
      fromAccount: {
        accountNumber: '4030048610100101',
        accountNickname: 'هيئه قناة السويس 34363',
        accountType: 'Current Accounts',
      },
      toAccount: {
        accountNumber: '4030048610100102',
        accountNickname: 'UJY IBNBL BUPHsdoifugopsu;gohjsdoiuhgpwertihwf;gkjhsldkjfhgldsjkhfjdlh',
        accountType: 'Current Accounts',
      },
      transferType: 'OWN',
      transferStatus: 'NOT_STARTED',
      transactionDate: '2025-06-26T00:00:00Z',
      scheduleDto: {
        submitDate: '25-06-2025',
        endDate: '04-07-2025',
        numberOfTransfers: 10,
        frequencyType: 'DAILY',
      },
      transferId: 'c5ae7dfb-e15d-4568-a479-551b35106b04',
      scheduleId: '06603790-2ac5-4f39-b746-bfbc01d858eb',
      scheduleStats: {
        numberOfSuccess: 1,
        numberOfPending: 0,
        numberOfFailed: 0,
        total: 10,
      },
      username: 'corp18',
      nextTransferDate: '2025-06-26T00:00:00Z',
    };
  }

  getUpcomingTransfers() {
    return {
      upcomingTransfers: [
        {
          transferId: '7a7d294f-7c78-4ef6-bf29-b90afdc1e019',
          transactionDate: '2025-06-26T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: 'b06ef043-801d-45b2-82c9-7ec0482866e8',
          transactionDate: '2025-06-27T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: '10539bdd-b074-4dbc-a089-f34cef66e3dd',
          transactionDate: '2025-06-28T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: '686ab017-8b61-441a-8e10-d4180760670e',
          transactionDate: '2025-06-29T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: 'b15cac15-9673-4ab3-ae18-85f7932a3283',
          transactionDate: '2025-06-30T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: '57ef4bef-52e0-46fe-988c-f0d10d5d9336',
          transactionDate: '2025-07-01T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: 'a6dee3d1-43f1-48af-afa2-1ee0e132857f',
          transactionDate: '2025-07-02T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: '7011984c-6795-4a9b-a6f7-2b1566f6be79',
          transactionDate: '2025-07-03T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: 'f9f51be0-83be-4a94-a278-c195178f9acf',
          transactionDate: '2025-07-04T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
        {
          transferId: '32714a1f-66ed-4a23-afe8-0cc66d047483',
          transactionDate: '2025-07-05T00:00:00Z',
          transferAmount: 1000,
          transferCurrency: 'EGP',
        },
      ],
      pagination: {
        pageStart: 0,
        totalSize: 10,
        pageSize: 10,
        totalPages: 1,
      },
    };
  }
}
