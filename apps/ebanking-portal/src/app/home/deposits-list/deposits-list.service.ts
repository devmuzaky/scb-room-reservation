import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class DepositsListService {
  private readonly http = inject(HttpClient);

  download(format: string, currencies: string[] = [], page = 0, size = 10) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    currencies.forEach(currency => {
      if (currency) {
        queryParams.append('currency', currency);
      }
    });

    return this.http.get<DownloadTDResponse>(
      `/api/dashboard/files/export/td/user/format/${format.toUpperCase()}?${queryParams.toString()}`,
    );
  }
}

export type DownloadTDResponse = {
  file: string;
  fileName?: string;
  fileType?: string;
  base64Content?: string;
};
