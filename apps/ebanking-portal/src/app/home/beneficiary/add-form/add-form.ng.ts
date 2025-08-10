/* eslint-disable no-extra-boolean-cast */
import { NgClass } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ToasterService } from '@/core/components';
import { ScbMaxLengthDirective } from '@/core/directives/max-length.directive';
import { NoInitialSpaceDirective } from '@/core/directives/no-initial-space.directive';
import { SingleSpaceBetweenWordsDirective } from '@/core/directives/single-space-between-words.directive';
import { CapitalizePipe } from '@/core/pipes/capitalize.pipe';
import {
  bankAccountNumberValidator,
  creditCardNumberValidator,
  ibanValidator,
  matchFieldsValidator,
  maxLengthValidator,
  mobileNumberValidator,
  noScriptsOrHtmlTagsValidator,
  paymentAddressValidator,
  walletNumberValidator,
} from '@/core/validators/custom-validators';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { dialogPortal } from '@scb/ui/dialog';
import { Error, FormField, Hint, Label, ScbInput } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { markControlsTouched } from '@scb/ui/input';
import { Option, Select } from '@scb/ui/select';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButton } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { BeneficiaryData } from '../beneficiary.data';
import { ConfirmAddBeneficiaryFormComponent } from '../confirm-form/confirm-form.ng';
import {
  BANK_ACCOUNT_PAYMENT_METHOD,
  BENEF_ERROR_CODES,
  CARD_PAYMENT_METHOD,
  IBAN_PAYMENT_METHOD,
  MOBILE_PAYMENT_METHOD,
  PAYMENT_ADDRESS_PAYMENT_METHOD,
  PAYMENT_METHODS_INSIDE,
  PAYMENT_METHODS_OUTSIDE,
  WALLET_PAYMENT_METHOD,
} from '../models/constants';
import {
  AddBeneficiaryFormData,
  AddBeneficiaryResponse,
  BankOfBeneficiary,
  Beneficiary,
  TransactionMethod,
} from '../models/models';

@Component({
  selector: 'beneficiary-add-form',
  templateUrl: './add-form.ng.html',
  providers: [BeneficiaryData],
  imports: [
    TranslocoDirective,
    FloatLabelModule,
    SelectModule,
    Icon,
    Hint,
    ScbInput,
    Error,
    Label,
    Button,
    FormField,
    ReactiveFormsModule,
    RadioButton,
    NgClass,
    Select,
    Option,
    ScbMaxLengthDirective,
    CapitalizePipe,
    NoInitialSpaceDirective,
    SingleSpaceBetweenWordsDirective,
    CheckboxModule,
  ],
})
export class AddBeneficiaryFormComponent implements OnInit {
  readonly dialogPortal = dialogPortal();
  readonly http = inject(HttpClient);
  readonly beneficiaryData = inject(BeneficiaryData);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly toasterService = inject(ToasterService);

  readonly type = input.required<'inside' | 'outside'>();
  readonly quickMode = input(false);

  readonly closed = output<boolean | Beneficiary>();

  readonly inside = computed(() => this.type() === 'inside');
  readonly outside = computed(() => this.type() === 'outside');

  readonly translateService = inject(TranslocoService);
  readonly paymentOptions = computed(() => (this.inside() ? PAYMENT_METHODS_INSIDE : PAYMENT_METHODS_OUTSIDE));

  readonly lang = computed(() => this.layoutFacade.language());
  readonly loading = signal(false);
  readonly canLeave = computed(() => this.layoutFacade.getCanLeave());

  // Signals to manage the visibility and validators of the fields
  readonly selectedPaymentMethod = signal<TransactionMethod>('BANK_ACCOUNT');
  readonly showBankAccountFields = signal(false);
  readonly showCardFields = signal(false);
  readonly showWalletFields = signal(false);
  readonly showMobileFields = signal(false);
  readonly showPaymentAddressFields = signal(false);
  readonly showIbanFields = signal(false);
  readonly showBankField = signal(false);
  readonly selectedBankLength = signal<number>(16);

  readonly bankListResource = httpResource<BankOfBeneficiary[]>(() => {
    return this.outside() ? `/api/transfer/beneficiary/banks` : '';
  });

  readonly bankList = computed(() => {
    const banks = this.bankListResource.value();
    if (banks) {
      // Filter out SUEZ_CANAL_BANK and store in the beneficiary store
      const filteredBanks = banks.filter((bank: BankOfBeneficiary) => bank.code !== 'SUEZ_CANAL_BANK');
      return filteredBanks;
    }
    return [];
  });

  readonly filterBankList = (option: BankOfBeneficiary) =>
    this.lang() === 'en' ? option.bankNameEn : option.bankNameAr;

  readonly form = new FormGroup(
    {
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, maxLengthValidator(), noScriptsOrHtmlTagsValidator()],
      }),
      nickname: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, maxLengthValidator(), noScriptsOrHtmlTagsValidator()],
      }),
      paymentMethod: new FormControl<TransactionMethod>(BANK_ACCOUNT_PAYMENT_METHOD, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      accountNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),
      confirmAccountNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),

      bank: new FormControl<string>('', { nonNullable: true }),

      cardNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),
      confirmCardNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),

      walletNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),
      confirmWalletNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),

      mobileNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),
      confirmMobileNumber: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),

      paymentAddress: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),

      iban: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),
      confirmIban: new FormControl('', {
        nonNullable: true,
        validators: [maxLengthValidator()],
      }),
      isActive: new FormControl<boolean>(false, {
        nonNullable: true,
      }),
    },
    {
      validators: [
        matchFieldsValidator('accountNumber', 'confirmAccountNumber'),
        matchFieldsValidator('cardNumber', 'confirmCardNumber'),
        matchFieldsValidator('walletNumber', 'confirmWalletNumber'),
        matchFieldsValidator('mobileNumber', 'confirmMobileNumber'),
        matchFieldsValidator('iban', 'confirmIban'),
      ],
    },
  );

  // Initialize the form and subscribe to payment method changes
  constructor() {
    // Subscribe to payment method changes and update the selected payment method
    this.form.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.selectedPaymentMethod.set(value);
      this.updateFieldVisibility();
      this.updateValidators();
    });
  }

  ngOnInit(): void {
    // Update leave guard when form changes
    this.form.valueChanges.subscribe(() => {
      this.layoutFacade.setCanLeave(!this.form.dirty);
    });

    this.form.get('bank')?.valueChanges.subscribe(bankCode => {
      if (this.outside() && this.form.get('paymentMethod')?.value === BANK_ACCOUNT_PAYMENT_METHOD && bankCode) {
        const selectedBank = this.bankList().find(bank => bank.code === bankCode);
        const selectedLength = selectedBank?.length ? parseInt(selectedBank.length) : 29;

        this.selectedBankLength.set(selectedLength);
        const accountNumberControl = this.form.get('accountNumber');
        const confirmAccountNumberControl = this.form.get('confirmAccountNumber');

        if (accountNumberControl && confirmAccountNumberControl) {
          accountNumberControl.setValidators([Validators.required, bankAccountNumberValidator(selectedLength)]);
          accountNumberControl.enable({ emitEvent: false });
          confirmAccountNumberControl.enable({ emitEvent: false });
          accountNumberControl.updateValueAndValidity();
          confirmAccountNumberControl.updateValueAndValidity();
        }
      }
    });

    // Start with initial visibility and validators setup
    this.updateFieldVisibility();
    this.updateValidators();
  }

  confirm() {
    if (this.form.invalid) {
      markControlsTouched(this.form, { touched: true, dirty: true });
      return;
    }

    const paymentMethod = this.form.value.paymentMethod;

    // Determine the appropriate beneficiary number based on payment method
    let beneficiaryNumber = '';
    if (paymentMethod === BANK_ACCOUNT_PAYMENT_METHOD) {
      beneficiaryNumber = this.form.value.accountNumber ?? '';
    } else if (paymentMethod === CARD_PAYMENT_METHOD) {
      beneficiaryNumber = this.form.value.cardNumber ?? '';
    } else if (paymentMethod === WALLET_PAYMENT_METHOD) {
      beneficiaryNumber = this.form.value.walletNumber ?? '';
    } else if (paymentMethod === MOBILE_PAYMENT_METHOD) {
      beneficiaryNumber = this.form.value.mobileNumber ?? '';
    } else if (paymentMethod === PAYMENT_ADDRESS_PAYMENT_METHOD) {
      beneficiaryNumber = this.form.value.paymentAddress ?? '';
    } else if (paymentMethod === IBAN_PAYMENT_METHOD) {
      beneficiaryNumber = this.form.value.iban ?? '';
    }

    // Create clean data object matching the required interface
    const cleanFormData = {
      beneficiaryName: this.form.value.name?.trim() ?? '',
      beneficiaryNickname: this.form.value.nickname?.trim() ?? '',
      transactionMethod: paymentMethod as TransactionMethod,
      beneficiaryNumber: beneficiaryNumber,
      bankName: this.form.value.bank ?? '',
      isActive: !this.quickMode() ? true : !!this.form.value?.isActive,
    } satisfies AddBeneficiaryFormData;

    this.loading.set(true);
    this.beneficiaryData
      .validateAndAddBeneficiary(cleanFormData, { outside: this.outside(), validate: this.quickMode() ? false : true })
      .subscribe({
        next: (response: AddBeneficiaryResponse) => {
          this.layoutFacade.setCanLeave(true);
          this.loading.set(false);
          if (response.status === 'success') {
            const bankCode = response.bankName || this.form.value.bank;
            const foundBank = this.bankList().find(x => x.code === bankCode);
            if (this.quickMode()) {
              this.beneficiaryData.getBeneficiaryDetails(response.beneficiaryId).subscribe(res => {
                const beneficiary: Beneficiary = {
                  beneficiaryId: res.beneficiaryId,
                  beneficiaryName: res.beneficiaryName!,
                  beneficiaryNickname: res.beneficiaryNickname,
                  beneficiaryNumber: res.beneficiaryNumber,
                  beneficiaryType: res.beneficiaryType,
                  transactionMethod: res.transactionMethod,
                  bank: res.bank,
                  // icon: response
                };
                this.closed.emit(beneficiary);
              });
              this.toasterService.showSuccess({
                severity: !!this.form.value?.isActive ? 'success' : 'info',
                summary: this.form.value.isActive
                  ? this.translateService.translate('beneficiary.addForm.success.title')
                  : this.translateService.translate('beneficiary.addForm.quickModeSuccess.title'),
                detail: this.form.value.isActive
                  ? this.translateService.translate('beneficiary.addForm.success.subTitle')
                  : this.translateService.translate('beneficiary.addForm.quickModeSuccess.subTitle'),
              });
            } else {
              this.dialogPortal.open(ConfirmAddBeneficiaryFormComponent, {
                containerClassNames: ['bg-white h-full p-xl dark:bg-gray-850'],
                classNames: ['self-end mb-2xl 2xl:mb-0 2xl:self-center w-full! 2xl:w-[376px]!'],
                disableClose: true,
                fullWindow: false,
                focusTrap: true,
                data: {
                  formData: cleanFormData,
                  inside: this.inside() as boolean,
                  outside: this.outside() as boolean,
                  foundBank: foundBank,
                },
              });
            }
          } else if (response.status === 'error' && response.errors && response.errors.length > 0) {
            // Handle field-specific errors from the API response
            this.handleError(response);
          }
          this.setBankNameOfIBAN(response);
        },
        error: (err: unknown) => {
          this.loading.set(false);
        },
      });
  }

  private updateFieldVisibility() {
    const method = this.selectedPaymentMethod();

    this.showBankAccountFields.set(method === BANK_ACCOUNT_PAYMENT_METHOD);
    this.showCardFields.set(method === CARD_PAYMENT_METHOD);
    this.showWalletFields.set(method === WALLET_PAYMENT_METHOD);
    this.showMobileFields.set(method === MOBILE_PAYMENT_METHOD);
    this.showPaymentAddressFields.set(method === PAYMENT_ADDRESS_PAYMENT_METHOD);
    this.showIbanFields.set(method === IBAN_PAYMENT_METHOD);

    // Bank field visibility and enabled/disabled logic
    if (this.outside()) {
      // Visible only for outside
      this.showBankField.set(
        method === BANK_ACCOUNT_PAYMENT_METHOD || method === CARD_PAYMENT_METHOD || method === IBAN_PAYMENT_METHOD,
      );
      // Enabled for BANK_ACCOUNT or CARD, disabled for IBAN
      const bankControl = this.form.get('bank');
      if (bankControl) {
        if (method === IBAN_PAYMENT_METHOD) {
          bankControl.disable({ emitEvent: false });
        } else {
          bankControl.enable({ emitEvent: false });
        }
      }
    } else {
      this.showBankField.set(false);
    }
  }

  private updateValidators() {
    const selectedPaymentMethodValue = this.form.get('paymentMethod')?.value;
    const selectedOption = this.paymentOptions().find(option => option.value === selectedPaymentMethodValue);

    // Remove all validators first and clear values for fields not part of the current payment method
    Object.keys(this.form.controls).forEach(fieldKey => {
      const control = this.form.get(fieldKey);
      if (control && fieldKey !== 'name' && fieldKey !== 'nickname' && fieldKey !== 'paymentMethod') {
        control.clearValidators();

        // Only clear values and mark as untouched for fields not needed for the current payment method
        if (!selectedOption?.requiredFields.includes(fieldKey)) {
          control.setValue('');
          control.markAsUntouched();
          control.markAsPristine();
        }

        control.updateValueAndValidity();
      }
    });

    // Add validators for required fields of the selected payment method
    if (selectedOption) {
      selectedOption.requiredFields.forEach(field => {
        const control = this.form.get(field);
        if (control) {
          const validatorsToAdd: ValidatorFn[] = [Validators.required];

          // Add specific format validators
          if (field === 'accountNumber')
            validatorsToAdd.push(bankAccountNumberValidator(this.outside() ? this.selectedBankLength() : 16));
          else if (field === 'cardNumber') validatorsToAdd.push(creditCardNumberValidator());
          else if (field === 'walletNumber') validatorsToAdd.push(walletNumberValidator());
          else if (field === 'mobileNumber') validatorsToAdd.push(mobileNumberValidator());
          else if (field === 'paymentAddress') validatorsToAdd.push(paymentAddressValidator());
          else if (field === 'iban') validatorsToAdd.push(ibanValidator());

          control.setValidators(validatorsToAdd);
          control.updateValueAndValidity();
        }
      });
    }

    if (this.outside() && selectedOption?.value === BANK_ACCOUNT_PAYMENT_METHOD) {
      const accountNumberControl = this.form.get('accountNumber');
      const confirmAccountNumberControl = this.form.get('confirmAccountNumber');
      if (accountNumberControl && confirmAccountNumberControl) {
        accountNumberControl.disable({ emitEvent: false });
        confirmAccountNumberControl.disable({ emitEvent: false });
      }
    }
    // Re-validate the entire form group to ensure cross-field validators are triggered
    this.form.updateValueAndValidity();
  }

  private handleError(response: AddBeneficiaryResponse) {
    response.errors?.forEach(error => {
      // code BENEF-101
      if (error.code === BENEF_ERROR_CODES.BENEFICIARY_NAME_TOO_LONG) {
        const control = this.form.controls.name;
        if (control) {
          control.setErrors({ tooLong: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-102
      if (error.code === BENEF_ERROR_CODES.BENEFICIARY_NICKNAME_TOO_LONG) {
        const control = this.form.controls.nickname;
        if (control) {
          control.setErrors({ tooLong: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-103
      if (error.code === BENEF_ERROR_CODES.BENEFICIARY_NICKNAME_EXISTS) {
        const control = this.form.controls.nickname;
        if (control) {
          control.setErrors({ unique: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-104
      // if (error.code === BENEF_ERROR_CODES.INVALID_TRANSACTION_METHOD) {
      //   const control = this.form.controls.paymentMethod;
      //   if (control) {
      //     control.setErrors({ invalidTransactionMethod: true, message: error.message });
      //     control.markAsTouched();
      //   }
      // }

      // code BENEF-105
      if (error.code === BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_ACCOUNT) {
        const control = this.form.controls.accountNumber;
        if (control) {
          // Set error on the specific form control
          control.setErrors({ invalidBeneficiaryNumberAccount: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-106
      if (error.code === BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_CARD) {
        const control = this.form.controls.cardNumber;
        if (control) {
          control.setErrors({ invalidBeneficiaryNumberCard: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-107
      if (error.code === BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_MOBILE) {
        const control = this.form.controls.mobileNumber;
        if (control) {
          control.setErrors({ invalidBeneficiaryNumberMobile: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-108
      if (error.code === BENEF_ERROR_CODES.MISSING_FIELD) {
        if (error.field === 'beneficiaryName') {
          const control = this.form.controls.name;
          if (control) {
            control.setErrors({ required: true, message: error.message });
            control.markAsTouched();
          }
        }
        if (error.field === 'beneficiaryNickname') {
          const control = this.form.controls.nickname;
          if (control) {
            control.setErrors({ required: true, message: error.message });
            control.markAsTouched();
          }
        }
        if (error.field === 'bankName') {
          const control = this.form.controls.bank;
          if (control) {
            control.setErrors({ requiredFromAPI: true, message: error.message });
            control.markAsTouched();
          }
        }
      }

      // code BENEF-109
      if (error.code === BENEF_ERROR_CODES.INVALID_ACCOUNT_NUMBER) {
        const control = this.form.controls.accountNumber;
        if (control) {
          control.setErrors({ invalidAccountNumber: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-110
      if (error.code === BENEF_ERROR_CODES.INVALID_MOBILE_NUMBER) {
        const control = this.form.controls.mobileNumber;
        if (control) {
          control.setErrors({ invalidMobileNumber: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-111
      if (error.code === BENEF_ERROR_CODES.INVALID_WALLET_NUMBER) {
        const control = this.form.controls.walletNumber;
        if (control) {
          control.setErrors({ invalidWalletNumber: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-112
      if (error.code === BENEF_ERROR_CODES.INVALID_CARD_NUMBER) {
        const control = this.form.controls.cardNumber;
        if (control) {
          control.setErrors({ invalidCardNumber: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-113
      if (error.code === BENEF_ERROR_CODES.INVALID_PAYMENT_ADDRESS) {
        const control = this.form.controls.paymentAddress;
        if (control) {
          control.setErrors({ invalidPaymentAddress: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-114
      // if (error.code === BENEF_ERROR_CODES.NO_BENEFICIARY_FOUND) {
      //   const control = this.form.controls.name;
      //   if (control) {
      //     control.setErrors({ noBeneficiaryFound: true, message: error.message });
      //     control.markAsTouched();
      //   }
      // }

      // code BENEF-115
      if (error.code === BENEF_ERROR_CODES.INVALID_BANK_NAME) {
        const control = this.form.controls.bank;
        if (control) {
          control.setErrors({ invalidBankName: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-116
      if (error.code === BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE) {
        const control = this.form.controls.accountNumber;
        if (control) {
          control.setErrors({ invalidBeneficiaryNumberBankAccountOutside: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-117
      if (error.code === BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_IBAN) {
        const control = this.form.controls.iban;
        if (control) {
          control.setErrors({ invalidIban: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-118
      if (error.code === BENEF_ERROR_CODES.INVALID_IBAN_PREFIX) {
        const control = this.form.controls.iban;
        if (control) {
          control.setErrors({ invalidIbanPrefix: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-119
      if (error.code === BENEF_ERROR_CODES.INVALID_IBAN_CODE) {
        const control = this.form.controls.iban;
        if (control) {
          control.setErrors({ invalidIbanCode: true, message: error.message });
          control.markAsTouched();
        }
      }

      // code BENEF-120
      if (error.code === BENEF_ERROR_CODES.INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE_DEFAULT) {
        const control = this.form.controls.accountNumber;
        if (control) {
          control.setErrors({ invalidAccountNumber: true, message: error.message });
          control.markAsTouched();
        }
      }
    });
  }

  private setBankNameOfIBAN(response: AddBeneficiaryResponse) {
    // Set bank name in case of IBAN is valid
    if (response.bankName && this.outside() && this.form.get('paymentMethod')?.value === IBAN_PAYMENT_METHOD) {
      const control = this.form.get('bank')!;
      control.patchValue(response.bankName, { emitEvent: false });
    }
  }
}
