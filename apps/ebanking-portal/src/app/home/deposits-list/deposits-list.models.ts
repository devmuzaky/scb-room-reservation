export interface TimeDeposit {
  tdNumber: string;
  tdType: string;
  tdAmount: number;
  currency: string;
  interestRate: number;
  maturityDate: string; // Consider using Date type if appropriate
  tenor: string;
  interestFrequency?: string;
}

export interface TimeDepositsResponse {
  totalAmount: number;
  totalPages: number;
  totalSize: number;
  lastUpdated: string;
  tdList: TimeDeposit[];
}
