import { MaskedAccountNumberPipe, MaskedAllAccountNumberPipe, MaskedPipe } from './masked.pipe';

describe('MaskedPipe', () => {
  let pipe: MaskedPipe;
  let maskNumberPipe: MaskedAccountNumberPipe;
  let maskAllNumberPipe: MaskedAllAccountNumberPipe;

  beforeEach(() => {
    pipe = new MaskedPipe();
    maskNumberPipe = new MaskedAccountNumberPipe();
    maskAllNumberPipe = new MaskedAllAccountNumberPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original value when visible is true', () => {
    const value = 'sensitive data';
    const visible = true;
    const result = pipe.transform(value, visible);
    expect(result).toBe(value);
  });

  it('should return masked value when visible is false with default repeat value', () => {
    const value = 'sensitive data';
    const visible = false;
    const expectedMask = '********'; // 8 asterisks
    const result = pipe.transform(value, visible);
    expect(result).toBe(expectedMask);
  });

  it('should return masked value with custom repeat value', () => {
    const value = 'sensitive data';
    const visible = false;
    const repeat = 5;
    const expectedMask = '*****'; // 5 asterisks
    const result = pipe.transform(value, visible, repeat);
    expect(result).toBe(expectedMask);
  });

  it('should handle empty string input', () => {
    const value = '';
    const visible = false;
    const expectedMask = '********'; // 8 asterisks
    const result = pipe.transform(value, visible);
    expect(result).toBe(expectedMask);
  });

  it('should handle empty string input with custom repeat', () => {
    const value = '';
    const visible = false;
    const repeat = 3;
    const expectedMask = '***';
    const result = pipe.transform(value, visible, repeat);
    expect(result).toBe(expectedMask);
  });

  it('should handle number inputs being converted to strings', () => {
    const value = 123456789;
    const visible = false;
    const expectedMask = '********';
    const result = pipe.transform(String(value), visible);
    expect(result).toBe(expectedMask);
  });

  it('should handle null or undefined input', () => {
    const visible = false;
    const expectedMask = '********';
    expect(pipe.transform(null as any, visible)).toBe(expectedMask);
    expect(pipe.transform(undefined as any, visible)).toBe(expectedMask);
  });

  it('should mask a 16-digit account number correctly', () => {
    expect(maskNumberPipe.transform('1630010010100101')).toBe('xxxx-xxxx-xxxx-0101');
  });

  it('should mask an IBAN correctly', () => {
    expect(maskNumberPipe.transform('EG12001700160163001000101')).toBe('xxxx-xxxx-xxxx-xxxx-xxxx-0101');
  });

  it('should handle a number input and convert it to string', () => {
    expect(maskNumberPipe.transform(1630010010100101)).toBe('xxxx-xxxx-xxxx-0101');
  });

  it('should handle shorter numbers correctly', () => {
    expect(maskNumberPipe.transform('1234')).toBe('1234'); // No masking needed
    expect(maskNumberPipe.transform('12')).toBe('12'); // No masking needed
  });

  it('should mask an 8-digit number correctly', () => {
    expect(maskNumberPipe.transform('123412345678')).toBe('xxxx-xxxx-5678');
  });

  it('should return default masked value for undefined or null', () => {
    expect(maskNumberPipe.transform(undefined)).toBe('xxxx-xxxx-xxxx-xxxx');
    expect(maskNumberPipe.transform(null as any)).toBe('xxxx-xxxx-xxxx-xxxx');
  });

  describe('MaskedAllAccountNumberPipe', () => {
    it('should mask all digits of a 16-digit account number', () => {
      expect(maskAllNumberPipe.transform('1630010010100101')).toBe('xxxx-xxxx-xxxx-xxxx');
    });

    it('should mask all digits of an IBAN', () => {
      expect(maskAllNumberPipe.transform('EG12001700160163001000101')).toBe('xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx');
    });

    it('should handle a number input and convert it to string', () => {
      expect(maskAllNumberPipe.transform(1630010010100101)).toBe('xxxx-xxxx-xxxx-xxxx');
    });

    it('should handle shorter numbers correctly', () => {
      expect(maskAllNumberPipe.transform('1234')).toBe('xxxx');
      expect(maskAllNumberPipe.transform('12')).toBe('xxxx');
    });

    it('should mask an 8-digit number correctly', () => {
      expect(maskAllNumberPipe.transform('12341234')).toBe('xxxx-xxxx');
    });

    it('should return default masked value for undefined or null', () => {
      expect(maskAllNumberPipe.transform(undefined)).toBe('xxxx-xxxx-xxxx-xxxx');
      expect(maskAllNumberPipe.transform(null as any)).toBe('xxxx-xxxx-xxxx-xxxx');
    });

    it('should handle empty string input', () => {
      expect(maskAllNumberPipe.transform('')).toBe('xxxx-xxxx-xxxx-xxxx');
    });
  });
});
