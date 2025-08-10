import { HttpClient } from '@angular/common/http';
import { fakeService, injectService } from '@scb/util/testing';
import { ActivateUserService } from './activate-user.service';

const httpClientStub = fakeService(HttpClient, {
  get: jest.fn(),
  post: jest.fn(),
});

describe('ActivateUserService', () => {
  let service: ActivateUserService;
  let http: HttpClient;

  beforeEach(() => {
    service = injectService(ActivateUserService, [ActivateUserService, httpClientStub]);
    http = injectService(HttpClient);
  });

  it('should validateUser call post with arguments', () => {
    const data = { username: 'scb' };
    service.validateUser(data);

    expect(http.post).toHaveBeenCalledWith(`/api/authentication/activate/userDetails`, data);
  });

  it('should resendOtp call with get', () => {
    const username = 'scb';
    service.resendOtp(username);

    expect(http.post).toHaveBeenCalledWith(`/api/authentication/activate/regenerate`, { username });
  });

  it('should validateOtp call post with arguments', () => {
    const data = { username: 'scb', activationcode: '123' };
    service.validateCode(data);

    expect(http.post).toHaveBeenCalledWith(`/api/authentication/activate/validate`, data);
  });

  it('should validateOtp call post with arguments', () => {
    const data = { username: 'scb', password: '123A12344' };
    service.createPassword(data);

    expect(http.post).toHaveBeenCalledWith(`/api/authentication/activate/setPassword`, data);
  });
});
