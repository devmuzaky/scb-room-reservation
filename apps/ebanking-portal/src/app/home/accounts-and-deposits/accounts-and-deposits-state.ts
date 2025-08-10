import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaginationData } from '@/core/components';
import { ApiResult } from '@/core/models/api';

@Injectable()
export class AccountsAndDepositsState {
  private readonly http = inject(HttpClient);
  readonly page = new PaginationData();

  download(format: string, page = 0, size = 10) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return this.http.get<DownloadTDResponse>(
      `/api/dashboard/files/export/accounts/all/user/format/${format.toUpperCase()}?${queryParams.toString()}`,
    );
  }

  generateAccountDetailPDF(data: { accountNumber: string }) {
    return this.http.post<ApiResult<{ pdfBase64: string }>>(`/api/dashboard/accounts/account-details/pdf`, data);
  }
}

export type DownloadTDResponse = {
  file: string;
  fileName?: string;
  fileType?: string;
  base64Content?: string;
};
