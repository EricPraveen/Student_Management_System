import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const SRI_LANKAN_PHONE_REGEX = /^(?:\+94|0)?7[0-9]{8}$/;

/**
 * Validates that an address is not purely whitespace and meets minimum length when provided.
 */
export function addressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const val = String(control.value);
    if (val.length > 0 && val.trim().length === 0) {
      return { whitespaceOnly: true };
    }

    if (val.trim().length > 0 && val.trim().length < 5) {
      return { minLength: { requiredLength: 5, actualLength: val.trim().length } };
    }

    if (val.length > 250) {
      return { maxLength: { requiredLength: 250, actualLength: val.length } };
    }

    return null;
  };
}

/**
 * Validates that date of birth is not in the future and after 1900-01-01.
 */
export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const val = String(control.value);
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      return { futureDate: true };
    }

    const minDate = new Date('1900-01-01T00:00:00');
    if (date < minDate) {
      return { minDate: true };
    }

    return null;
  };
}
