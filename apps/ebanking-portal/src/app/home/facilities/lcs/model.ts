export interface LcsRes {
  data: LcsData[];
  pagination: LcsPagination;
}

export interface LcsData {
  lcNumber: string;
  cashCover: number;
  maturityDate: number;
  lcType: string;
  lcTypeDescription: string;
  lcAmount: number;
  lcCurrency: string;
  cashCoverPercentage: number;
  cashCoverCurrency: number;
  outstandingBalance: number;
}

export interface LcsPagination {
  pageStart: number;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface LcTypeRes {
  lcTypes: LcType[];
}

export interface LcType {
  key: string;
  value: string;
}

export type LcsType = 'LISC' | 'LISU' | 'LIDC' | 'LIDU' | 'LIMC' | 'LIMU';
