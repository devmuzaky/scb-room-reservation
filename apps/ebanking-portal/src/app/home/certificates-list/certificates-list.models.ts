export interface Certificate {
  CdNumber: string;
  amount: number;
  currency: string;
  interestRate: number;
  maturityDate: string;
  type: string;
}

export interface CertificatesData {
  lastUpdatedTimestamp: number;
  totalBalance: number;
  totalRecords?: number;
  totalPages: number;
  certificateListDos: Certificate[];
}
