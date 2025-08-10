import { HttpClient } from '@angular/common/http';
import { fakeService, injectService } from '@scb/util/testing';
import { RegistrationService } from './registration.service';

const httpStub = fakeService(HttpClient, {
  get: jest.fn(),
  post: jest.fn(),
});

describe('RegistrationService', () => {
  let service: RegistrationService;

  beforeEach(() => {
    service = injectService(RegistrationService, [RegistrationService, httpStub]);
  });

  it('should register user call post with arguments', () => {
    const data = { companyId: 'scb', mobileNumber: '123' };
    service.registerUser(data);

    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/user/register`, data);
  });

  it('should resendOtp call with get', () => {
    const username = 'scb';
    const token = 'test';
    service.resendOtp(username, token);

    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/otp/resend`, { username, token });
  });

  it('should validateOtp call post with arguments', () => {
    const data = { otp: '123456', token: '123' };
    service.validateOtp(data);

    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/otp/validate`, data);
  });

  it('should generate base64 string to call post with arguments', () => {
    const data = { companyId: '123456', token: '123' };
    service.generatePDF(data);
    expect(httpStub.v.post).toHaveBeenCalledWith(`/api/authentication/user/getForm`, data);
  });
});
