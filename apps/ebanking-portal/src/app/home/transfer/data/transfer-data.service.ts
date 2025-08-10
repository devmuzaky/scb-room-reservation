import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BeneficiaryResponse } from '@/home/beneficiary/list/beneficiary.ng';
import { PAYMENT_METHODS_OUTSIDE } from '@/home/beneficiary/models/constants';
import { Beneficiary } from '@/home/beneficiary/models/models';
import {
  AccountDTO,
  AccountListResponseDTO,
  CharityItem,
  CharityListResponse,
  ReasonListResponse,
  TransferDataResponse,
} from '../model';

@Injectable()
export class TransferDataService {
  private readonly http = inject(HttpClient);

  readonly fromAccountsData = signal<AccountDTO[]>([]);
  readonly toAccountsData = signal<AccountDTO[]>([]);
  readonly fromAccountsLoading = signal(false);
  readonly toAccountsLoading = signal(false);
  readonly fromAccountsError = signal<string | null>(null);
  readonly toAccountsError = signal<string | null>(null);

  readonly transferLookupData = signal<TransferDataResponse | undefined>(undefined);
  readonly transferLookupLoading = signal(false);
  readonly transferLookupError = signal<string | null>(null);

  readonly reasonsData = signal<{ data: any[] }>({ data: [] });
  readonly reasonsLoading = signal(false);
  readonly reasonsError = signal<string | null>(null);

  readonly beneficiariesData = signal<Record<string, Beneficiary[]>>({});
  readonly beneficiariesLoading = signal<Record<string, boolean>>({});
  readonly beneficiariesError = signal<Record<string, string | null>>({});

  private readonly ongoingRequests = new Set<string>();
  private readonly ongoingAccountRequests = new Set<string>();
  private readonly ongoingCharityRequest = signal(false);

  readonly charityData = signal<CharityItem[]>([]);
  readonly charityLoading = signal(false);
  readonly charityError = signal<string | null>(null);

  readonly transferTypes = computed(() => this.transferLookupData()?.transferType || []);
  readonly chargeBearers = computed(() => this.transferLookupData()?.chargeBearer || []);
  readonly frequencyTypes = computed(() => this.transferLookupData()?.frequencyType || []);
  readonly transferNetworksFiltered = computed(() => {
    const data = this.transferLookupData()?.transferNetwork || [];
    return data.filter(x => ['ACH', 'IPN'].includes(x.key));
  });
  readonly reasons = computed(() => this.reasonsData().data);
  readonly charityList = computed(() => this.charityData());

  readonly filteredFromAccounts = computed(() => {
    return (skipAccount?: string) =>
      this.fromAccountsData().filter(account => !skipAccount || account.accountNumber !== skipAccount);
  });

  readonly filteredToAccounts = computed(() => {
    return (skipAccount?: string) =>
      this.toAccountsData().filter(account => !skipAccount || account.accountNumber !== skipAccount);
  });

  loadAllTransferData(currency?: string): void {
    this.loadAccountsData(currency);
    this.loadTransferLookupData();
    this.loadReasonsData();
  }

  loadAllTransferDataWithCharity(currency?: string): void {
    this.loadAllTransferData(currency);
    this.loadCharityData();
  }

  loadAccountsData(currency?: string): void {
    this.loadFromAccounts(currency);
    this.loadToAccounts(currency);
  }

  loadFromAccounts(currency?: string): void {
    const cacheKey = `from_${currency || 'all'}`;

    if (this.fromAccountsData().length > 0 && !currency) {
      return;
    }

    if (this.ongoingAccountRequests.has(cacheKey)) {
      return;
    }

    this.ongoingAccountRequests.add(cacheKey);

    this.fromAccountsLoading.set(true);
    this.fromAccountsError.set(null);

    this.http.get<AccountListResponseDTO>(`/api/transfer/accounts/from`).subscribe({
      next: response => {
        const accounts = response.data || [];
        accounts.forEach(x => (x.currency = x.currency.toUpperCase()));
        this.fromAccountsData.set(accounts);
        this.fromAccountsLoading.set(false);
        this.ongoingAccountRequests.delete(cacheKey);
      },
      error: () => {
        this.fromAccountsError.set('Failed to load accounts');
        this.fromAccountsLoading.set(false);
        this.ongoingAccountRequests.delete(cacheKey);
      },
    });
  }

  loadToAccounts(currency?: string): void {
    const cacheKey = `to_${currency || 'all'}`;

    if (this.toAccountsData().length > 0 && !currency) {
      return;
    }

    // Check if request is already in progress
    if (this.ongoingAccountRequests.has(cacheKey)) {
      return;
    }

    // Mark request as ongoing
    this.ongoingAccountRequests.add(cacheKey);

    this.toAccountsLoading.set(true);
    this.toAccountsError.set(null);

    this.http.get<AccountListResponseDTO>(`/api/transfer/accounts/to`).subscribe({
      next: response => {
        const accounts = response.data || [];
        accounts.forEach(x => (x.currency = x.currency.toUpperCase()));
        this.toAccountsData.set(accounts);
        this.toAccountsLoading.set(false);
        this.ongoingAccountRequests.delete(cacheKey);
      },
      error: () => {
        this.toAccountsError.set('Failed to load accounts');
        this.toAccountsLoading.set(false);
        this.ongoingAccountRequests.delete(cacheKey);
      },
    });
  }

  loadTransferLookupData(): void {
    if (this.transferLookupData()) {
      return;
    }

    this.transferLookupLoading.set(true);
    this.transferLookupError.set(null);

    this.http.get<TransferDataResponse>('/api/transfer/lookup/transfer-data').subscribe({
      next: response => {
        this.transferLookupData.set(response);
        this.transferLookupLoading.set(false);
      },
      error: () => {
        this.transferLookupError.set('Failed to load transfer lookup data');
        this.transferLookupLoading.set(false);
      },
    });
  }

  loadReasonsData(): void {
    if (this.reasonsData().data.length > 0) {
      return;
    }

    this.reasonsLoading.set(true);
    this.reasonsError.set(null);

    this.http.get<ReasonListResponse>('/api/transfer/reason/list').subscribe({
      next: response => {
        this.reasonsData.set(response);
        this.reasonsLoading.set(false);
      },
      error: () => {
        this.reasonsError.set('Failed to load reasons data');
        this.reasonsLoading.set(false);
      },
    });
  }

  loadBeneficiariesData(beneficiaryType: string): void {
    const cacheKey = beneficiaryType;

    if (this.beneficiariesData()[cacheKey]?.length > 0) {
      return;
    }

    if (this.ongoingRequests.has(cacheKey)) {
      return;
    }

    this.ongoingRequests.add(cacheKey);

    this.beneficiariesLoading.update(state => ({ ...state, [cacheKey]: true }));
    this.beneficiariesError.update(state => ({ ...state, [cacheKey]: null }));

    this.http.get<BeneficiaryResponse>('/api/transfer/beneficiary/list', { params: { beneficiaryType } }).subscribe({
      next: response => {
        const beneficiaries = Array.isArray(response.data)
          ? response.data.map(beneficiary => {
              const icon = PAYMENT_METHODS_OUTSIDE.find(item => item.id === beneficiary.transactionMethod)?.icon;
              return { ...beneficiary, icon: icon || 'bank' };
            })
          : [];

        this.beneficiariesData.update(state => ({ ...state, [cacheKey]: beneficiaries }));
        this.beneficiariesLoading.update(state => ({ ...state, [cacheKey]: false }));
        this.ongoingRequests.delete(cacheKey);
      },
      error: () => {
        this.beneficiariesError.update(state => ({ ...state, [cacheKey]: 'Failed to load beneficiaries' }));
        this.beneficiariesLoading.update(state => ({ ...state, [cacheKey]: false }));
        this.ongoingRequests.delete(cacheKey);
      },
    });
  }

  loadCharityData(): void {
    if (this.charityData().length > 0) {
      return;
    }

    this.charityLoading.set(true);
    this.charityError.set(null);

    this.http.get<CharityListResponse>('/api/transfer/charity/list').subscribe({
      next: response => {
        this.charityData.set(response.charityList || []);
        this.charityLoading.set(false);
      },
      error: () => {
        this.charityError.set('Failed to load charity data');
        this.charityLoading.set(false);
      },
    });
  }

  refreshAccountsData(type: 'from' | 'to', currency?: string): void {
    const cacheKey = `${type}_${currency || 'all'}`;
    this.ongoingAccountRequests.delete(cacheKey);

    if (type === 'from') {
      this.fromAccountsData.set([]);
      this.loadFromAccounts(currency);
    } else {
      this.toAccountsData.set([]);
      this.loadToAccounts(currency);
    }
  }

  refreshBeneficiariesData(beneficiaryType: string): void {
    const cacheKey = beneficiaryType;

    this.beneficiariesData.update(state => {
      const newState = { ...state };
      delete newState[cacheKey];
      return newState;
    });
    this.ongoingRequests.delete(cacheKey);

    this.loadBeneficiariesData(beneficiaryType);
  }

  refreshCharityData(): void {
    this.charityData.set([]);
    this.ongoingCharityRequest.set(false);
    this.loadCharityData();
  }

  getBeneficiaries(beneficiaryType: string, transactionMethod?: string): Beneficiary[] {
    const cacheKey = beneficiaryType;
    const allBeneficiaries = this.beneficiariesData()[cacheKey] || [];

    // Return all if no transaction method is specified
    if (!transactionMethod) {
      return allBeneficiaries;
    }

    // Filter on the frontend
    return allBeneficiaries.filter(beneficiary => beneficiary.transactionMethod === transactionMethod);
  }

  isBeneficiariesLoading(beneficiaryType: string): boolean {
    const cacheKey = beneficiaryType;
    return this.beneficiariesLoading()[cacheKey] || false;
  }

  getBeneficiariesError(beneficiaryType: string): string | null {
    const cacheKey = beneficiaryType;
    return this.beneficiariesError()[cacheKey] || null;
  }

  getAvailableCurrencies(type: 'from' | 'to'): string[] {
    const accounts = type === 'from' ? this.fromAccountsData() : this.toAccountsData();
    return [...new Set(accounts.map(account => account.currency))];
  }

  getAccountsByCurrency(type: 'from' | 'to', currency: string): AccountDTO[] {
    const accounts = type === 'from' ? this.fromAccountsData() : this.toAccountsData();

    if (!currency) {
      return accounts;
    }

    return accounts.filter((account: AccountDTO) => account.currency.toUpperCase() === currency.toUpperCase());
  }

  filterBeneficiaries(beneficiaries: Beneficiary[], searchTerm: string): Beneficiary[] {
    if (!searchTerm) {
      return beneficiaries;
    }

    const term = searchTerm.toLowerCase();
    return beneficiaries.filter(
      beneficiary =>
        beneficiary.beneficiaryName.toLowerCase().includes(term) ||
        beneficiary.beneficiaryNickname?.toLowerCase().includes(term) ||
        beneficiary.beneficiaryNumber?.toLowerCase().includes(term),
    );
  }

  filterCharities(searchTerm: string): CharityItem[] {
    if (!searchTerm) {
      return this.charityData();
    }

    const term = searchTerm.toLowerCase();
    return this.charityData().filter(charity => {
      const nameEN = charity.customerNameEN?.toLowerCase() || '';
      const nameAR = charity.customerNameAR?.toLowerCase() || '';
      return nameEN.includes(term) || nameAR.includes(term);
    });
  }

  getCharityName(charity: CharityItem, isArabic: boolean): string {
    if (isArabic) {
      return charity.customerNameAR || charity.customerNameEN;
    } else {
      return charity.customerNameEN || charity.customerNameAR;
    }
  }

  getFilteredAccounts(type: 'from' | 'to', searchTerm?: string, skipAccount?: string): AccountDTO[] {
    const accounts = type === 'from' ? this.fromAccountsData() : this.toAccountsData();
    let filtered = accounts;

    if (skipAccount) {
      filtered = filtered.filter((account: AccountDTO) => account.accountNumber !== skipAccount);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((account: AccountDTO) => {
        const accountNumber = account.accountNumber?.toString().toLowerCase() || '';
        const nickname = account.nickname?.toLowerCase() || '';
        return accountNumber.includes(term) || nickname.includes(term);
      });
    }

    return filtered;
  }
}
