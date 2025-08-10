export type ERROR_TYPE = undefined | 'API' | 'TOKEN' | 'NOTELIGIBLE';
export interface ChequebookItem {
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

export interface PaginationInfo {
  pageStart: number;
  pageToken: string;
  totalSize: number;
  pageSize: number;
  totalPages: number;
}

export interface ChequebookApiResponse {
  chequebooks: ChequebookItem[];
  lastUpdated: string;
  pagination: PaginationInfo;
}

export interface ChequeBookQuery {
  status?: string;
  pageStart: number;
  pageSize: number;
}

export interface LinkedAccountDTO {
  nickname: string;
  categoryDescription: string;
  accountNumber: string;
  workingBalance: number;
  currency: string;
  OVD?: boolean;
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

export interface SelectChequeBookAccountFieldProps {
  type: 'linked' | 'debit';
  accountSelected: LinkedAccountListResponseDTO;
}

export interface LinkedAccountInfo {
  accountNumber: string;
  accountNickname: string;
  categoryDescription: string;
  availableBalance: number;
}
export interface numberOfLeavesResponse {
  data: {
    reasonAr: string;
    reasonEn: string;
  }[];
}

export interface ChequeBookRequestDTO {
  accountNumber: string;
  accountNickname: string;
  accountType: string;
  feeDebitedAccountNumber: string;
  branchDetails: string;
  chequebooksIssued: number;
  leavesCount: number;
  requestDate: string;
  fees?: number;
  tandc?: boolean;
}

export interface ChequeSaveError {
  errorId: string;
  code: string;
  message: string;
  errors: [
    {
      code: string;
      field: string;
      message: string;
    },
  ];
  details: string;
}

export interface TermsAndConditions {
  language: string;
  terms: string;
}

export interface ChequeBookFeeRequest {
  numberOfChequebooks: number;
  numberOfLeaves: number;
}

export interface FeesResponse {
  fee: number;
  currency: string;
}

export interface ChequeBookInfo {
  accountNickname: string;
  accountType: string;
  accountNumber: string;
  accountCurrency: string;
  chequebooksIssued: number;
  leavesCount: number;
  requestDate: string;
  status?: string;
  cifBranch?: string;
  issueFee?: number;
  statusHistory?: { status: string; date: string }[];
}

export interface ErrorDetail {
  fieldName: string | null;
  code: string;
  message: string;
}

export interface ErrorResponse {
  error: {
    type: string;
    errorDetails: ErrorDetail[];
  };
}

export interface ApiErrorResponse {
  successResponse: null;
  errorResponse: ErrorResponse;
  status: string;
}

export interface StatusItem {
  status: string;
  date: string;
}

export interface ChequebookDetail {
  accountNickname: string;
  accountType: string;
  accountNumber: string;
  accountCurrency: string;
  chequebooksIssued: number;
  leavesCount: number;
  status: string;
  cifBranch: string;
  issueFee: number;
  requestDate: string; // or Date
  statusHistory: StatusItem[];
}
