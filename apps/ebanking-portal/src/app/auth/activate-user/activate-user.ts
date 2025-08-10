import { Injectable, signal } from '@angular/core';

@Injectable()
export class ActivateUser {
  readonly step = signal(1);
  readonly username = signal('');
  readonly email = signal('');
  readonly attempts = signal(3);
  readonly userDetails = signal({ phone: '' });
  otpToken = '';
  resetToken = '';

  next() {
    this.step.update(x => x + 1);
  }

  extractTokenData(token: string): { email: string; mobile: string; expiration: string } | null {
    try {
      let base64 = token.replace(/-/g, '+').replace(/_/g, '/');

      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const decodedText = atob(base64);

      const parts = decodedText.split(':');

      if (parts.length < 3) {
        return null;
      }

      return {
        email: parts[0],
        mobile: parts[1],
        expiration: parts.slice(2).join(':'),
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
