export type ProductResponse<T> = ProductResult<T[]>;

export interface ProductResult<T> {
  status: string;
  message: string;
  data: T;
}

export interface ProductCdDetail {
  cdTdId: string;
  title: string;
  interestRate: string;
  frequency: string;
  interestType: string; // FIXED, FLOATING
  minimumDeposit: string;
  maturityAction: string;
  categoryId: string;
  currency: string;
  duration: string; // 36M, 60M
  tdType: string;
  tdRef: string;
  new: boolean;
}

export interface ProductTdDetail {
  cdTdId: string;
  title: string;
  interestRate: string;
  frequency: string;
  interestType: string;
  minimumDeposit: string;
  categoryId: number;
  currency: string;
  duration: string;
  tdType: string; // "FLOATING",
  tdRef: string; // "21012-12M",
  new: boolean;
}

export interface ProductAccount {
  accountListResponse: ProductAccountList;
  interestRateResponses: InterestRates[];
}

export interface InterestRates {
  from: string;
  to: string;
  interestRate: string;
}

export interface ProductAccountList {
  accountType: string;
  categoryId: string;
  productId: string;
  interest: string;
  // categoryType: string;
  interestType: string;
  frequency: string;
  minimumDeposit?: string;
  maxDeposit: string;
  minForInterest: string;
  currency?: string;
  checkBookAvailable: boolean;
  accountTitle: string;
  accountDescription: string;
}

export type ERROR_TYPE = undefined | 'API' | 'TOKEN' | 'INSUFFICIENT_BALANCE';

export interface TdCreateRequest {
  token: string;
  tdType?: string;
  currencyId: string;
  amount: string;
  categoryId: string;
  drawdownAccount: string;
  prinLiqAcct: string;
  selectedCategory: string;
  duration: string;
  cdTdId: string;
  tdRef?: string;
}

export interface TDInterestRateResponse {
  data: TimeDeposit[];
}

export interface TimeDeposit {
  tdRef: string;
  frequency: string;
  currencyList: CurrencyRates[];
}

export interface CurrencyRates {
  currency: string;
  intervals: RateInterval[];
}

export interface RateInterval {
  amountFrom: string;
  amountTo: string;
  rate: string;
}

export interface TDFixedInterestRateResponse {
  data: TDFixedRate[];
}

export interface TDFixedRate {
  fromAmt: string;
  toAmt: string;
  interestRate: number;
}

export interface DurationOption {
  key: string;
  value: string;
  label: string;
}
export interface TdTenorApiResponse {
  data: DurationOption[];
}
