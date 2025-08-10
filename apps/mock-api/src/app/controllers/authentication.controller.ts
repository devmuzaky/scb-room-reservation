import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtService } from '../services/jwt.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private jwtService: JwtService) {}

  @Get('auth/gen-key')
  @HttpCode(HttpStatus.OK)
  genKey() {
    const publicKey =
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjTqUwzt2toDuyImvf/s6Gny/b0XrSxvzpzGMoMnys/ddQgCtbUkB4NBUHSov1b895bn6YYDQRqeRi4qgbZQlQR8BtLbYCUNx1S8uDBggckgQHMIxt65wibYRTme1VRQw6m1xUn/cGOwDqV+wWCqCpgypmzjzWWZVpW6uv+e1ZQzkt8iizC6qRzR3QRiJYdhl4TT5OyucSPcGQZJ7xCTrHNKTyhscvgZTSSFiujf4V9vNoZE9fpThJ5wuFAdbrSkDLXTCwgeTpUMx+9yWNAeJpEP3673EXWO8qoIdDWip0i/ysYe0l0oIWNDMvBZfumCD8Z6TFF7OEOpF8ykuVuTTGwIDAQAB';
    return {
      publicKey,
    };
  }

  @Post('auth/mobile/login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Headers('recaptcha-token') recaptchaToken: string,
    @Headers('public-key') publicKey: string,
    @Headers('Content-Type') contentType: string,
  ) {
    if (contentType !== 'application/x-www-form-urlencoded') {
      throw new HttpException('Invalid Content-Type header', HttpStatus.BAD_REQUEST);
    }

    // Generate short-lived JWT tokens for mock testing
    const { accessToken, refreshToken, expiresIn } = this.jwtService.generateTokens({ username });

    // credentials for Maker User
    // return {
    //   accessToken:
    //     'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQU2hlcmxGdWkwcnJJMnQta084Q2IzTXNUaHkxTHNackRRSUduMTBrNU13In0.eyJleHAiOjE3NTQ2MDMzMjAsImlhdCI6MTc1NDU5OTcyMCwianRpIjoiZTg3MGFkNDgtZWM1OS00MmExLTk1ZDUtMDk3ZjQ4MGZkYzQxIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmFwcHMuc2Nib2NwLnNjYi5sb2NhbC9yZWFsbXMvc2NiLWNvcnAiLCJhdWQiOlsiYXV0aC1zdmMiLCJ0cmFuc2Zlci1zdmMiLCJzb2Z0dG9rZW4tc3ZjIiwiZGFzaGJvYXJkLXN2YyIsInByb2R1Y3Qtc3ZjIiwiYWNjb3VudCJdLCJzdWIiOiJkZjUxYjhhMC1kYmRkLTRhMjgtODJiNS1lZmJlOWZkN2FjYTUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhdXRoLXN2YyIsInNpZCI6ImI4ZDE5ZGM2LTk5NDItNDM2Zi1iN2YwLTczNDgyNDcyNTgzYiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLXNjYi1jb3JwIiwidW1hX2F1dGhvcml6YXRpb24iLCJNQUtFUiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoic29mdFRva2VuSWQgc29mdFRva2VuU3RhdHVzIGNpZiBzZWNvbmROYW1lIHByb2ZpbGUgaWROdW1iZXIgbW9iaWxlIGNvbXBhbnlOYW1lIHNvZnRUb2tlblNlcmlhbCBlbWFpbCB0aGlyZE5hbWUiLCJjaWYiOiI0MDMwMDQ4NiIsImxhc3ROYW1lIjoidXNlciIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY29tcGFueU5hbWUiOiJzY2IiLCJtb2JpbGUiOiIwMTAxMjM0NTY3ODkiLCJ0aGlyZE5hbWUiOiJ1c2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibWFrZXIiLCJpZE51bWJlciI6IjI5MDExMTEwMTAzMzMiLCJnaXZlbl9uYW1lIjoibWFrZXIiLCJuYW1lIjoibWFrZXIgdXNlciIsImZhbWlseV9uYW1lIjoidXNlciIsImVtYWlsIjoibWFrZXJAc2NiLmNvbSIsInNlY29uZE5hbWUiOiJ1c2VyIn0.XNOZVcf0iecM9mum7i1lGBlKmy03LeAglCIwLx1L0yeb8AqQ0y_GfNHysOarQjNWpVCStMpD9GNBkPDSesg8La8OKcAtK8N1jrk9cPKmSMnuCxae1QA1LYyEWvefu5ZBYj0eMwpPtprY4IWLwZ7TLjJYvVnx6UHvKfDKacEV9JGaxCyv1aHGsulEfIGZ89rCUfetu_zC9H0PPohn7XXQ0QoSsLZHXpVc20IGbmjARcI3MihkrVEjKkOy_kZJL9j2_C6JXXVGrmXfVuOwm6OicgtCVQtdW22XXBdzHhu63LbVWHGGchPH2yaYfFbkOevtl46TQBHAbrgQ5HxY7NqQ-w',
    //   refreshToken:
    //     'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQU2hlcmxGdWkwcnJJMnQta084Q2IzTXNUaHkxTHNackRRSUduMTBrNU13In0.eyJleHAiOjE3NTQ2MDMzMjAsImlhdCI6MTc1NDU5OTcyMCwianRpIjoiZTg3MGFkNDgtZWM1OS00MmExLTk1ZDUtMDk3ZjQ4MGZkYzQxIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmFwcHMuc2Nib2NwLnNjYi5sb2NhbC9yZWFsbXMvc2NiLWNvcnAiLCJhdWQiOlsiYXV0aC1zdmMiLCJ0cmFuc2Zlci1zdmMiLCJzb2Z0dG9rZW4tc3ZjIiwiZGFzaGJvYXJkLXN2YyIsInByb2R1Y3Qtc3ZjIiwiYWNjb3VudCJdLCJzdWIiOiJkZjUxYjhhMC1kYmRkLTRhMjgtODJiNS1lZmJlOWZkN2FjYTUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhdXRoLXN2YyIsInNpZCI6ImI4ZDE5ZGM2LTk5NDItNDM2Zi1iN2YwLTczNDgyNDcyNTgzYiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLXNjYi1jb3JwIiwidW1hX2F1dGhvcml6YXRpb24iLCJNQUtFUiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoic29mdFRva2VuSWQgc29mdFRva2VuU3RhdHVzIGNpZiBzZWNvbmROYW1lIHByb2ZpbGUgaWROdW1iZXIgbW9iaWxlIGNvbXBhbnlOYW1lIHNvZnRUb2tlblNlcmlhbCBlbWFpbCB0aGlyZE5hbWUiLCJjaWYiOiI0MDMwMDQ4NiIsImxhc3ROYW1lIjoidXNlciIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY29tcGFueU5hbWUiOiJzY2IiLCJtb2JpbGUiOiIwMTAxMjM0NTY3ODkiLCJ0aGlyZE5hbWUiOiJ1c2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibWFrZXIiLCJpZE51bWJlciI6IjI5MDExMTEwMTAzMzMiLCJnaXZlbl9uYW1lIjoibWFrZXIiLCJuYW1lIjoibWFrZXIgdXNlciIsImZhbWlseV9uYW1lIjoidXNlciIsImVtYWlsIjoibWFrZXJAc2NiLmNvbSIsInNlY29uZE5hbWUiOiJ1c2VyIn0.XNOZVcf0iecM9mum7i1lGBlKmy03LeAglCIwLx1L0yeb8AqQ0y_GfNHysOarQjNWpVCStMpD9GNBkPDSesg8La8OKcAtK8N1jrk9cPKmSMnuCxae1QA1LYyEWvefu5ZBYj0eMwpPtprY4IWLwZ7TLjJYvVnx6UHvKfDKacEV9JGaxCyv1aHGsulEfIGZ89rCUfetu_zC9H0PPohn7XXQ0QoSsLZHXpVc20IGbmjARcI3MihkrVEjKkOy_kZJL9j2_C6JXXVGrmXfVuOwm6OicgtCVQtdW22XXBdzHhu63LbVWHGGchPH2yaYfFbkOevtl46TQBHAbrgQ5HxY7NqQ-w',
    //   expiresIn: 3600,
    // };

    // credentials for Super User
    return { accessToken, refreshToken, expiresIn };
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
    }

    const newAccessToken = this.jwtService.refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    return {
      accessToken: newAccessToken,
      expiresIn: 900,
    };
  }

  @Post('auth/validate-user')
  @HttpCode(HttpStatus.OK)
  validateUser(@Body('companyId') companyId: string) {
    if (companyId === '123') {
      throw new HttpException(
        { code: 'OTP-003', details: { hoursRemaining: '2025-03-18T11:28:41.177Z' } },
        HttpStatus.BAD_REQUEST,
      );
    }
    return { numberOfAttempts: 1, token: 'token123', maskedMobileNumber: '*****987', maskedEmail: '88888.com' };
  }

  @Post('auth/forget-password')
  @HttpCode(HttpStatus.OK)
  forgetPassword(@Body('password') password: string, @Body('token') token: string) {
    return {
      message: 'Success',
    };
  }

  @Post('activate/userDetails')
  @HttpCode(HttpStatus.OK)
  userDetails() {
    return { maskedMobileNumber: '01111111111', maskedEmail: 'wudhdn@lcmckc.co' };
  }

  @Post('activate/regenerate')
  @HttpCode(HttpStatus.OK)
  resendOtp() {
    return { numberOfAttempts: 2 };
  }

  @Post('activate/validate')
  @HttpCode(HttpStatus.OK)
  validateCode(@Body('activationCode') activationCode: string) {
    return { token: 2 };
  }

  @Post('activate/setPassword')
  @HttpCode(HttpStatus.NO_CONTENT)
  createPassword(@Body('password') password: string) {
    return null; // No content
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  sendOtp(@Body('token') token: string) {
    return { numberOfAttempts: '1' };
  }

  @Post('otp/resend')
  @HttpCode(HttpStatus.OK)
  resendOTP(@Body('token') token: string) {
    return { numberOfAttempts: '1' };
  }

  @Post('otp/validate')
  @HttpCode(HttpStatus.OK)
  validateOtp(@Body('otp') otp: string, @Body('token') token: string) {
    if (otp === '123456') {
      return { token: 'token12345' };
    } else if (otp === '234567') {
      throw new HttpException({ code: 'OTP-002' }, HttpStatus.BAD_REQUEST);
    }
    throw new HttpException({ code: 'OTP-001' }, HttpStatus.BAD_REQUEST);
  }

  @Post('user/register')
  @HttpCode(HttpStatus.OK)
  registerUser(@Body('companyId') companyId: string, @Body('mobileNumber') mobileNumber: string) {
    return { numberOfAttempts: '1', otpToken: '123token', maskedMobile: '*****8765', maskedEmail: '8888@ci.co' };
  }

  @Post('user/getForm')
  @HttpCode(HttpStatus.OK)
  generatePDF(@Body('companyId') companyId: string, @Body('token') token: string) {
    return {
      file: 'file_string',
    };
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { message: 'Logged out successfully' };
  }

  @Get('auth/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  verifyAuth(@Req() req) {
    return req.user;
  }

  @Get('auth/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  me(@Req() req) {
    return {
      username: 'corp100',
      email: 'hatem@corporate.com',
      roles: ['MAKER'],
      companyName: 'AL-Hatem Group',
      cif: '01102757',
      softTokenId: '123',
      softTokenSerial: '123',
      softTokenStatus: 'PENDING',
    };
  }
}
