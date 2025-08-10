import { HttpClient } from '@angular/common/http';
import { fakeService, injectService } from '@scb/util/testing';
import { AccountDetailsService } from './account-details.service';

const httpStub = fakeService(HttpClient, {
  get: jest.fn(),
  post: jest.fn(),
});

describe('AccountDetailsService', () => {
  let service: AccountDetailsService;

  beforeEach(() => {
    service = injectService(AccountDetailsService, [AccountDetailsService, httpStub]);
  });

  it('should generate base64 string to call post with arguments', () => {
    const data = { accountNumber: '123456' };
    service.generateAccountDetailPDF(data);
    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/dashboard/accounts/account-details/pdf`, data);
  });
});
