import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('soft-token/token')
@UseGuards(JwtAuthGuard)
export class SoftTokenController {
  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  getUserStatus() {
    return SoftTokenInitiateResponse;
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  registerUser(@Body('registrationCode') registrationCode: string) {
    return SoftTokenActivateResponse;
  }

  @Post('validate-otp')
  @HttpCode(HttpStatus.OK)
  validateOtp(@Body('otp') otp: string) {
    return SoftTokenValidateOtpResponse;
  }
}

export const SoftTokenInitiateResponse = {
  serialNumber: '988-5142',
  activationCode: '8965-4564-5236',
  qrCode: 'base64image',
  qrCodeLink: 'https://example.com/token/qr',
};

export const SoftTokenActivateResponse = {
  activated: true,
};

export const SoftTokenValidateOtpResponse = {
  valid: true,
};
