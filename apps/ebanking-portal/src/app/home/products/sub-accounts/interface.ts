export interface SubAccountCreateRequest {
  token: string;
  currencyId: string;
  categoryId: string;
  accountType: string;
  frequency: string;
  amount: number;
  // valueDate: string;
  isChequebookAvailable: boolean;
  debitAccountNumber: string;
  productId: string;
}
