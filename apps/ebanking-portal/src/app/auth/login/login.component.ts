import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { HeaderAuthComponent } from '@/layout/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Alert } from '@scb/ui/alert';
import { alertPortal } from '@scb/ui/alert-dialog';
import { Button, ButtonVariant } from '@scb/ui/button';
import { Captcha } from '@scb/ui/captcha';
import { Error, FormField, Label, PasswordInput, ScbInput } from '@scb/ui/form-field';
import { markControlsTouched } from '@scb/ui/input';
import { Separator } from '@scb/ui/separator';
import { EncryptionService } from '@scb/util/encryption';
import { EXTERNAL_LINKS } from '../../core/constants/urls';
import { AuthService } from '../api/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthService, EncryptionService],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Button,
    FormField,
    Label,
    ScbInput,
    Separator,
    Error,
    PasswordInput,
    Captcha,
    RouterLink,
    Alert,
    HeaderAuthComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private layoutStore = inject(LayoutFacadeService);
  private encryptionService = inject(EncryptionService);
  private readonly alert = alertPortal();

  private captcha = viewChild.required<Captcha>('captcha');
  readonly privacyPolicyURL = computed(() =>
    this.layoutStore.language() === 'en' ? EXTERNAL_LINKS.privacyPolicy.en : EXTERNAL_LINKS.privacyPolicy.ar,
  );

  readonly termsAndConditionsURL = computed(() =>
    this.layoutStore.language() === 'en' ? EXTERNAL_LINKS.termsAndConditions.en : EXTERNAL_LINKS.termsAndConditions.ar,
  );

  readonly callUsUrl = computed(() =>
    this.layoutStore.language() === 'en' ? EXTERNAL_LINKS.callUs.en : EXTERNAL_LINKS.callUs.ar,
  );

  readonly sncUrl = computed(() =>
    this.layoutStore.language() === 'en'
      ? EXTERNAL_LINKS.suggestionsAndComplaints.en
      : EXTERNAL_LINKS.suggestionsAndComplaints.ar,
  );

  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly loading = signal(false);
  readonly error = signal<{ code: string; message: string }>({ code: '', message: '' });
  readonly alertErrorDetail = signal<{ title: string; message: string }>({
    title: '',
    message: '',
  });

  private readonly commonErrorDetails = {
    title: 'login.serverUnavailable',
    message: 'login.serverUnavailableDesc',
    buttonText: 'retry',
  };

  errorMapping: { [key in ERR]?: { title: string; message: string; buttonText?: string } } = {
    [ERR.INTERNAL_SERVER_CLIENT_ERROR]: this.commonErrorDetails,
    [ERR.INTERNAL_SERVER_FATAL_ERROR]: this.commonErrorDetails,
    [ERR.INTERNAL_SERVER_PROCESSING_ERROR]: this.commonErrorDetails,
    [ERR.INTERNAL_SERVER_UNKNOWN_ERROR]: this.commonErrorDetails,
    [ERR.INTERNAL_SERVER]: this.commonErrorDetails,
    [ERR.USER_LOCKED]: {
      title: 'login.credentialsLockedTitle',
      message: 'login.credentialsLockedDesc',
    },
  };

  alertErrorMapping: { [key in ERR]?: { title: string; message: string } } = {
    [ERR.BAD_CREDENTIALS]: {
      title: 'incorrectCredentialsTitle',
      message: 'invalidCredentialsDesc',
    },
    [ERR.INVALID_RECAPTCHA]: {
      title: 'invalidRecaptchaTitle',
      message: 'invalidRecaptchaDesc',
    },
    [ERR.USER_INACTIVE]: {
      title: 'inactiveUserTitle',
      message: 'inactiveUserDesc',
    },
  };

  async submit() {
    if (this.form.invalid) {
      markControlsTouched(this.form);
      return;
    }

    this.loading.set(true);
    const token = await this.captcha().getToken();

    await this.callLogin(token || '');
  }

  private async callLogin(token: string) {
    const values = this.form.getRawValue();
    const encryptedData = await this.encryptionService.encryptData(values.password);

    this.auth
      .login({ username: values.username, password: encryptedData.encryptedPassword }, token, encryptedData.publicKey)
      .pipe(
        switchMap(() => {
          return this.auth.me().pipe(
            tap(() => {
              this.loading.set(false);
              this.router.navigate(['dashboard'], { replaceUrl: true });
            }),
          );
        }),
      )
      .subscribe({
        next: () => {
          // this.router.navigate(['dashboard']);
        },
        error: error => {
          console.error('Login error:', error);
          this.loading.set(false);
          this.error.set({ code: error.error.code, message: error.error.message });
          this.handleServerError(error);
          this.handleAlertErrorDetail(error.error.code);
        },
      });
  }

  openDialog(title: string, message: string, buttonText?: string, showRetry?: boolean): void {
    const actions = [
      {
        text: this.translocoService.translate('cancel'),
        type: 'secondary' as ButtonVariant,
        handler: (close: () => void) => close(),
      },
    ];

    if (showRetry) {
      actions.unshift({
        text: this.translocoService.translate(buttonText || 'retry'),
        type: 'primary' as ButtonVariant,
        handler: (close: () => void) => close(),
      });
    }

    this.alert.open({
      title: this.translocoService.translate(title),
      description: this.translocoService.translate(message),
      actions: actions,
    });
  }

  handleServerError(error: ApiError): void {
    const errorDetail = this.errorMapping[error.error.code];
    if (errorDetail && error.error.code === ERR.USER_LOCKED) {
      this.openDialog(errorDetail.title, errorDetail.message, undefined, false);
    } else if (errorDetail) {
      this.openDialog(errorDetail.title, errorDetail.message, errorDetail.buttonText, true);
    }
  }

  handleAlertErrorDetail(errorCode: ERR): void {
    const alertDetails = this.alertErrorMapping[errorCode];
    if (alertDetails) {
      this.alertErrorDetail.set(alertDetails);
    }
  }
}
