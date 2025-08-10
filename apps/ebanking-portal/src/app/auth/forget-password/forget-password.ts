import { Injectable, signal } from '@angular/core';

@Injectable()
export class ForgetPassword {
  readonly step = signal(1);
  readonly username = signal('');
  readonly attempts = signal(3);
  readonly userDetails = signal({ phone: '', email: '' });
  otpToken = '';
  resetToken = '';

  next() {
    this.step.update(x => x + 1);
  }
}
