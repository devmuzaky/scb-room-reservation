import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResult } from '@/models/api';

@Injectable()
export class AccountDetailsService {
  private readonly http = inject(HttpClient);

  generateAccountDetailPDF(data: { accountNumber: string | null }) {
    return this.http.post<ApiResult<{ pdfBase64: string }>>(`/api/dashboard/accounts/account-details/pdf`, data);
  }
}
