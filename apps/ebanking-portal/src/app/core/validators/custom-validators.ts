import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function bankAccountNumberValidator(numberLength = 29): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const isValid = new RegExp(`^\\d{${numberLength}}$`).test(value);
    return isValid ? null : { bankAccountNumber: true };
  };
}

export function walletNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = /^\d{11}$/.test(value);
    return isValid ? null : { walletNumber: true };
  };
}

export function mobileNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = /^\d{11}$/.test(value);
    return isValid ? null : { mobileNumber: true };
  };
}

export function paymentAddressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = /^.{3,50}$/.test(value);
    return isValid ? null : { paymentAddress: true };
  };
}

export function creditCardNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = /^\d{16}$/.test(value);
    return isValid ? null : { creditCardNumber: true };
  };
}

export function ibanValidator(): ValidatorFn {
  // IBANs are alphanumeric and have a structure that can be validated more thoroughly.
  // For this example, we're sticking to 29 digits as per the request.
  // A more robust IBAN validation would check country code, check digits, and length based on country.
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    // Assuming an IBAN of 29 digits as requested, a more typical IBAN regex is /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}$/
    const isValid = /^[A-Za-z]{2}\d{27}$/.test(value);
    return isValid ? null : { iban: true };
  };
}

export function noScriptsOrHtmlTagsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    // Regex to detect <script> or any HTML tags
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(value);
    const hasScriptTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value);

    if (hasHtmlTags || hasScriptTags) {
      return { xssAttempt: true };
    }
    return null;
  };
}

export function matchFieldsValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      // If controls are not found, don't validate
      return null;
    }

    // Set error on matchingControl if validation fails, to display the error message next to the confirmation field
    if (matchingControl.errors && !matchingControl.errors['mismatch']) {
      // Return if another validator has already found an error on the matchingControl
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mismatch: true });
      return { mismatch: true }; // Also return error at form group level if needed, or just rely on control error
    } else {
      // Clear only the mismatch error, preserving other errors
      if (matchingControl.errors && matchingControl.errors['mismatch']) {
        delete matchingControl.errors['mismatch'];
        if (Object.keys(matchingControl.errors).length === 0) {
          matchingControl.setErrors(null);
        } else {
          matchingControl.setErrors(matchingControl.errors);
        }
      }
      return null;
    }
  };
}

export function maxLengthValidator(maxLength = 50): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = value.length <= maxLength;
    return isValid ? null : { maxLength: { requiredLength: maxLength, actualLength: value.length } };
  };
}

export function insufficientBalanceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value < 0.01) {
      return { insufficientBalance: true };
    }
    return null;
  };
}

export function minCurrencyAmountValidator(amount: number) {
  return (control: AbstractControl) => {
    const value = control.value;
    return value === '.' || +value < amount ? { min: 'required' } : null;
  };
}
