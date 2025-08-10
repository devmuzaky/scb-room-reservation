import { HttpClient } from '@angular/common/http';
import { fakeService, injectService } from '@scb/util/testing';
import { AccountsListService } from './accounts-list.service';

const httpStub = fakeService(HttpClient, {
  get: jest.fn(),
  post: jest.fn(),
});

describe('AccountsListService', () => {
  let service: AccountsListService;

  beforeEach(() => {
    service = injectService(AccountsListService, [AccountsListService, httpStub]);
  });

  it('should call get account list with and valid values', () => {
    const currency = 'EGP,USD';
    const page = 5;
    const size = 10;
    const format = 'CSV';

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    params.set('currency', currency);

    service.downloadAccountList(format, currency, page, size);

    expect(httpStub.v.get).toHaveBeenCalledWith(
      `/api/dashboard/files/export/accounts/user/format/${format}?${params.toString()}`,
    );
  });

  it('should call download account list with valid currency', () => {
    const currency = 'EGP,USD';
    const format = 'CSV';
    const page = 0;
    const size = 10;

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    params.set('currency', currency);

    service.downloadAccountList(format, currency, page, size);

    expect(httpStub.v.get).toHaveBeenCalledWith(
      `/api/dashboard/files/export/accounts/user/format/${format}?${params.toString()}`,
    );
  });

  it('should call download account list with default values and no currency', () => {
    const format = 'CSV';
    const page = 0;
    const size = 10;

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    service.downloadAccountList(format);

    expect(httpStub.v.get).toHaveBeenCalledWith(
      `/api/dashboard/files/export/accounts/user/format/${format}?${params.toString()}`,
    );
  });
});
