export interface LoanDetailsResponse {
  loanDescription: string;
  accountNumber: string;
  totalLoanAmount: number;
  tenor: string;
  paidAmount: number;
  remainingAmount: number;
  totalInstallments: number;
  totalPaidInstallments: number;
  remainingInstallments: number;
  installmentFrequency: string;
  maturityDate: string;
  interestRate: number;
  installmentAmount: number;
  installmentDate: string;
  currency: string;
}
