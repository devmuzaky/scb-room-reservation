import { NumberCommaFormatPipe } from './format-number.pipe';

describe('NumberCommaFormatPipe', () => {
  let pipe: NumberCommaFormatPipe;

  beforeEach(() => {
    pipe = new NumberCommaFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null input', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format number with commas', () => {
    expect(pipe.transform(1234567)).toBe('1,234,567');
    expect(pipe.transform(1000000)).toBe('1,000,000');
    expect(pipe.transform(1234.56)).toBe('1,234.56');
  });

  it('should handle string numbers with commas', () => {
    expect(pipe.transform('1,234,567')).toBe('1,234,567');
    expect(pipe.transform('1000000')).toBe('1,000,000');
    expect(pipe.transform('1234.56')).toBe('1,234.56');
  });

  it('should handle negative numbers', () => {
    expect(pipe.transform(-1234567)).toBe('-1,234,567');
    expect(pipe.transform('-1,234,567')).toBe('-1,234,567');
  });

  it('should handle decimal numbers', () => {
    expect(pipe.transform(1234567.89)).toBe('1,234,567.89');
    expect(pipe.transform('1234567.89')).toBe('1,234,567.89');
  });

  it('should return "Invalid Number" for non-numeric strings', () => {
    expect(pipe.transform('abc')).toBe('Invalid Number');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('0');
    expect(pipe.transform('0')).toBe('0');
  });

  it('should handle small numbers without commas', () => {
    expect(pipe.transform(123)).toBe('123');
    expect(pipe.transform('123')).toBe('123');
  });
});
