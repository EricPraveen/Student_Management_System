import { FormControl } from '@angular/forms';
import { SRI_LANKAN_PHONE_REGEX, addressValidator, dateOfBirthValidator } from './student.validators';

describe('StudentValidators', () => {
  describe('addressValidator', () => {
    const validator = addressValidator();

    it('should allow empty/null address', () => {
      expect(validator(new FormControl(null))).toBeNull();
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('should reject whitespace-only address', () => {
      expect(validator(new FormControl('   '))).toEqual({ whitespaceOnly: true });
      expect(validator(new FormControl('\t  '))).toEqual({ whitespaceOnly: true });
    });

    it('should reject address shorter than 5 characters', () => {
      expect(validator(new FormControl('ABC'))).toEqual({ minLength: { requiredLength: 5, actualLength: 3 } });
      expect(validator(new FormControl('  AB  '))).toEqual({ minLength: { requiredLength: 5, actualLength: 2 } });
    });

    it('should reject address longer than 250 characters', () => {
      const longAddress = 'A'.repeat(251);
      expect(validator(new FormControl(longAddress))).toEqual({ maxLength: { requiredLength: 250, actualLength: 251 } });
    });

    it('should accept valid address', () => {
      expect(validator(new FormControl('123 Main Street, Colombo'))).toBeNull();
      expect(validator(new FormControl('Jaffna, Sri Lanka'))).toBeNull();
    });
  });

  describe('dateOfBirthValidator', () => {
    const validator = dateOfBirthValidator();

    it('should allow empty/null date of birth', () => {
      expect(validator(new FormControl(null))).toBeNull();
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('should reject future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 2);
      const str = future.toISOString().split('T')[0];
      expect(validator(new FormControl(str))).toEqual({ futureDate: true });
    });

    it('should reject dates before 1900-01-01', () => {
      expect(validator(new FormControl('1899-12-31'))).toEqual({ minDate: true });
    });

    it('should accept valid dates in the past', () => {
      expect(validator(new FormControl('2000-01-15'))).toBeNull();
    });
  });

  describe('SRI_LANKAN_PHONE_REGEX', () => {
    it('should validate Sri Lankan mobile numbers', () => {
      expect(SRI_LANKAN_PHONE_REGEX.test('0771234567')).toBe(true);
      expect(SRI_LANKAN_PHONE_REGEX.test('+94771234567')).toBe(true);
      expect(SRI_LANKAN_PHONE_REGEX.test('771234567')).toBe(true);

      expect(SRI_LANKAN_PHONE_REGEX.test('0111234567')).toBe(false);
      expect(SRI_LANKAN_PHONE_REGEX.test('abcdefghij')).toBe(false);
      expect(SRI_LANKAN_PHONE_REGEX.test('07712345')).toBe(false);
    });
  });
});
