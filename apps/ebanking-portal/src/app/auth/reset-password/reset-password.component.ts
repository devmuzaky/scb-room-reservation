import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { TranslocoDirective } from '@jsverse/transloco';
import { Autofocus } from '@scb/ui/a11y';
import { Alert } from '@scb/ui/alert';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { Error, FormField, Label, PasswordInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { markControlsTouched } from '@scb/ui/input';

@Component({
  selector: 'app-forget-password-success',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Button, Icon, RouterLink, TranslocoDirective],
  template: `
    <scb-card
      class="px-xl py-3xl sm:p-4xl flex flex-col text-center"
      *transloco="let t">
      <div class="mb-xl h-7xl flex justify-center">
        <icon
          [name]="layoutFacade.isDarkTheme() ? 'web-success-dark' : 'web-success'"
          data-testid="FP_ICON_SUCCESS" />
      </div>
      <h4
        class="head-md-s mb-4xl"
        data-testid="FP_TEXT_SUCCESS_TITLE">
        <ng-content />
      </h4>
      <button
        scbButton
        routerLink="/login"
        data-testid="FP_BTN_BACK_TO_LOGIN">
        {{ t('backToLogin') }}
      </button>
    </scb-card>
  `,
})
export class ForgetPasswordSuccessComponent {
  readonly layoutFacade = inject(LayoutFacadeService);
}

type ResetForm = FormGroup<{
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}>;

@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    Card,
    Button,
    FormField,
    PasswordInput,
    Error,
    Label,
    Icon,
    Alert,
    Autofocus,
    TranslocoDirective,
    ForgetPasswordSuccessComponent,
  ],
  template: `
    @if (success()) {
      <app-forget-password-success>
        <ng-content select=".success-title" />
      </app-forget-password-success>
    } @else {
      <scb-card
        class="px-xl py-3xl sm:p-4xl"
        *transloco="let t">
        <form
          class="gap-4xl flex flex-col"
          [formGroup]="form"
          (ngSubmit)="submit()"
          data-testid="FP_FORM">
          <h4
            data-testid="FP_TEXT_RESET_PASSWORD"
            class="head-md-s text-center">
            <ng-content select=".password-title" />
          </h4>
          <div class="gap-2xl flex flex-col">
            <scb-form-field>
              <label
                data-testid="FP_LABEL_NEW_PASSWORD"
                scbLabel
                >{{ t('fp.newPassword') }}</label
              >
              <input
                meeAutofocus
                scbPasswordInput
                formControlName="password"
                class="test-new-password"
                data-testid="FP_INPUT_NEW_PASSWORD" />
              <p
                data-testid="FP_TEXT_NP_ERROR"
                scbError="required">
                {{ t('fp.newPasswordRequired') }}
              </p>
            </scb-form-field>
            <scb-form-field>
              <label
                data-testid="FP_LABEL_CONFIRM_PASSWORD"
                scbLabel
                >{{ t('fp.confirmPassword') }}</label
              >
              <input
                scbPasswordInput
                formControlName="confirmPassword"
                class="test-confirm-password"
                data-testid="FP_INPUT_CONFIRM_PASSWORD" />
              <p
                data-testid="FP_TEXT_CP_ERROR"
                scbError="required">
                {{ t('fp.confirmPasswordRequired') }}
              </p>
              <p
                data-testid="FP_TEXT_CP_MISMATCH"
                scbError
                [invalid]="misMatch()">
                {{ t('fp.notMatch') }}
              </p>
            </scb-form-field>

            <div class="gap-md flex flex-col">
              <p
                class="body-sm-s text-text-secondary"
                data-testid="FP_TEXT_RULE_TITLE">
                {{ t('fp.ruleTitle') }}
              </p>
              @for (req of validatorTxt(); track req.text; let index = $index) {
                <div class="body-label-sm gap-sm text-text-tertiary flex">
                  <icon
                    [name]="req.status"
                    [attr.data-testid]="'LOCATEUS_ICON_RULE_' + index"
                    [class]="
                      req.normal === 0
                        ? 'text-icon-disabled'
                        : req.normal === 1
                          ? 'text-icon-success'
                          : 'text-icon-danger'
                    " />
                  {{ t(req.text) }}
                </div>
              }
            </div>
            @if (error() && !form.dirty) {
              <scb-alert
                [title]="t('securityProtection.title')"
                [desc]="t('securityProtection.desc')"
                data-testid="FP_ALERT_ERROR"
                hideClose />
            }
          </div>
          <button
            scbButton
            type="submit"
            data-testid="FP_BTN_CONTINUE"
            [loading]="loading()">
            {{ t('continue') }}
          </button>
        </form>
      </scb-card>
    }
  `,
})
export class ResetPasswordComponent {
  private readonly router = inject(Router);

  readonly username = input.required<string>();
  readonly api = input.required<(password: string) => Observable<any>>();
  readonly afterSuccess = output();

  readonly loading = signal(false);
  readonly error = signal(false);
  readonly success = signal(false);

  private readonly requirements = [
    {
      text: 'fpRules.rule1',
      test: (password: string) => password.length >= 8 && password.length <= 20,
    },
    {
      text: 'fpRules.rule2',
      test: (password: string) => /[A-Z]/.test(password),
    },
    {
      text: 'fpRules.rule3',
      test: (password: string) => /[a-z]/.test(password),
    },
    {
      text: 'fpRules.rule4',
      test: (password: string) => /[0-9]/.test(password),
    },
    {
      text: 'fpRules.rule5',
      test: (password: string) => /[@#$%&^-]/.test(password),
    },
    {
      text: 'fpRules.rule6',
      test: (password: string) => !password.toLowerCase().includes(this.username()),
    },
    {
      text: 'fpRules.rule7',
      test: (password: string) => !/(.)(\1{2,})/.test(password),
    },
    {
      text: 'fpRules.rule8',
      test: (password: string) =>
        !/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|ABC|BCD|CDE|DEF|EFG|FGH|GHI|HIJ|IJK|JKL|KLM|LMN|MNO|NOP|OPQ|PQR|QRS|RST|STU|TUV|UVW|VWX|WXY|XYZ|123|234|345|456|567|678|789/.test(
          password,
        ),
    },
  ];

  readonly form: ResetForm = new FormGroup(
    {
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordValidator()],
        nonNullable: true,
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    { validators: [this.passwordMatchValidator] },
  );

  readonly something = toSignal(this.form.statusChanges, { equal: () => false });
  readonly misMatch = computed(() => {
    const _ = this.something();
    const cp = this.form.controls.confirmPassword;
    return cp.touched && !cp.errors?.['required'] && this.form.errors?.['mismatch'];
  });

  private readonly password = toSignal(this.form.controls.password.valueChanges);
  readonly validatorTxt = computed(() => {
    const password = this.password();

    return this.requirements.map(req => {
      const status = password ? (req.test(password) ? 'success' : 'failure') : 'success';
      return {
        text: req.text,
        normal: !password ? 0 : status === 'success' ? 1 : 2,
        status,
      };
    });
  });

  submit() {
    if (this.form.invalid) return markControlsTouched(this.form, { dirty: true, touched: true });

    const { password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(false);
    const api = this.api();
    api(password).subscribe({
      next: () => {
        this.success.set(true);
        this.afterSuccess.emit();
      },
      error: (error: ApiError) => {
        this.loading.set(false);
        if (error.error.code === ERR.REPEATED_PASSWORD) {
          this.form.reset();
          this.error.set(true);
        } else if (error.error.code === ERR.EXPIRED_TOKEN) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  private passwordValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.value;

      if (!password) {
        return null;
      }

      const isValid = this.requirements.every(req => req.test(password));

      return isValid ? null : { passwordRequirements: true };
    };
  }

  private passwordMatchValidator(c: AbstractControl) {
    const g = c as ResetForm;
    return g.controls.password.value === g.controls.confirmPassword.value ? null : { mismatch: true };
  }
}
