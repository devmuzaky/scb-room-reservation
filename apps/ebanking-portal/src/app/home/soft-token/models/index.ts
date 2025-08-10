export interface SoftTokenInitiateResponse {
  serialNumber: string;
  activationCode: string;
  qrCode: string;
  qrCodeLink: string;
}

export interface SoftTokenActivateResponse {
  activated: boolean;
}

export interface SoftTokenValidateOtpResponse {
  valid: boolean;
}
