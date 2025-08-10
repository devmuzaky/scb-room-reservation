import { HttpClient } from '@angular/common/http';
import { fakeService, injectService } from '@scb/util/testing';
import { ForgetPasswordService } from './forget-password.service';

const httpStub = fakeService(HttpClient, {
  get: jest.fn(),
  post: jest.fn(),
});

describe('ForgetPasswordService', () => {
  let service: ForgetPasswordService;

  beforeEach(() => {
    service = injectService(ForgetPasswordService, [ForgetPasswordService, httpStub]);
  });

  it('should validateUser call post with arguments', () => {
    const data = { username: 'scb', companyId: '123' };
    service.validateUser(data);

    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/auth/validate-user`, data);
  });

  it('should resendOtp call with get', () => {
    const username = 'scb';
    const token = 'test';
    service.resendOtp(username, token);

    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/otp/send`, { username, token });
  });

  it('should validateOtp call post with arguments', () => {
    const data = { username: 'scb', otp: '123', token: 'test' };
    service.validateOtp(data);

    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/otp/validate`, data);
  });

  it('should forgetPassword call post with arguments', () => {
    const data = { username: 'scb', password: '123', token: 'test' };
    service.forgetPassword(data);

    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/auth/forget-password`, data);
  });
});
