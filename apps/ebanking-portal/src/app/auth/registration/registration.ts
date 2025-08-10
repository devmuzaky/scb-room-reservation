import { Injectable, signal } from '@angular/core';

@Injectable()
export class Registration {
  readonly step = signal(1);
  readonly username = signal('');
  readonly attempts = signal(3);
  readonly companyId = signal('');
  readonly otp = signal('');
  readonly mobileNumber = signal('');
  readonly userDetails = signal({ phone: '', email: '' });
  otpToken = '';
  resetToken = '';

  next() {
    this.step.update(x => x + 1);
  }
}
