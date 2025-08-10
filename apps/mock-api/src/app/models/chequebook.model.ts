export interface ChequeBookRequest {
  accountNickname: string;
  accountType: string;
  accountNumber: string;
  accountCurrency: string;
  chequebooksIssued: number;
  leavesCount: number;
  status: string;
  cifBranch: string;
  issueFee: number;
  requestDate: string;
}

export interface ChequebookApiResponse {
  chequebooks: ChequeBookRequest[];
  lastUpdated: string;
  pagination: {
    pageStart: number;
    pageToken: string;
    totalSize: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ChequeBookQuery {
  pageStart: number;
  pageSize: number;
  status?: string[];
}

export interface LinkedAccountDTO {
  nickname: string;
  categoryDescription: string;
  accountNumber: string;
  workingBalance: number;
  currency: string;
  OVD?: boolean; // Optional field for Overdraft Value
}

export interface PaginationDTO {
  totalSize: number;
  pageStart: number;
  pageSize: number;
  totalPages: number;
}

export interface LinkedAccountListResponseDTO {
  accounts: LinkedAccountDTO[];
  pagination: PaginationDTO;
}
