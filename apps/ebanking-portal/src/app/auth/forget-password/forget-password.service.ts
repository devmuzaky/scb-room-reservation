import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResult } from '@/models/api';

@Injectable()
export class ForgetPasswordService {
  readonly http = inject(HttpClient);

  validateUser(data: { username: string; companyId: string }) {
    return this.http.post<
      ApiResult<{ numberOfAttempts: number; token: string; maskedMobileNumber: string; maskedEmail: string }>
    >(`/api/authentication/auth/validate-user`, data);
  }

  resendOtp(username: string, token: string) {
    return this.http.post<ApiResult<{ numberOfAttempts: number }>>(`/api/authentication/otp/send`, { username, token });
  }

  validateOtp(data: { username: string; otp: string; token: string }) {
    return this.http.post<ApiResult<{ token: string }>>(`/api/authentication/otp/validate`, data);
  }

  forgetPassword(data: { username: string; password: string; token: string }) {
    return this.http.post<ApiResult<null>>(`/api/authentication/auth/forget-password`, data);
  }
}
