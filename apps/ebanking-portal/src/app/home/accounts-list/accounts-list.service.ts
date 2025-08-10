import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class AccountsListService {
  private readonly http = inject(HttpClient);

  downloadAccountList(format: string, currency = '', page = 0, size = 10) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (currency) {
      queryParams.set('currency', currency);
    }

    return this.http.get<{ file: string }>(
      `/api/dashboard/files/export/accounts/user/format/${format.toUpperCase()}?${queryParams.toString()}`,
    );
  }
}
