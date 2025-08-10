import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResult } from '@/models/api';

@Injectable()
export class RegistrationService {
  readonly http = inject(HttpClient);

  registerUser(data: { companyId: string; mobileNumber: string }) {
    return this.http.post<
      ApiResult<{ numberOfAttempts: number; otpToken: string; maskedMobile: string; maskedEmail: string }>
    >(`/api/authentication/user/register`, data);
  }

  resendOtp(username: string, token: string) {
    return this.http.post<ApiResult<{ numberOfAttempts: number }>>(`/api/authentication/otp/resend`, {
      username,
      token,
    });
  }

  validateOtp(data: { otp: string; token: string }) {
    return this.http.post<ApiResult<{ token: string }>>(`/api/authentication/otp/validate`, data);
  }

  generatePDF(data: { companyId: string; token: string }) {
    return this.http.post<ApiResult<{ file: string }>>(`/api/authentication/user/getForm`, data);
  }
}
