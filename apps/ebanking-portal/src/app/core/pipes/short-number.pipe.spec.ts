import { ShortNumberPipe } from './short-number.pipe';

describe('ShortNumberPipe', () => {
  let pipe: ShortNumberPipe;

  beforeEach(() => {
    pipe = new ShortNumberPipe();
  });

  it('should transform null to an empty string', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should transform undefined to an empty string', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should transform negative to an empty string', () => {
    expect(pipe.transform(-1)).toBe('-1');
  });

  it('should transform non-numeric strings to "Invalid Number"', () => {
    expect(pipe.transform('abc')).toBe('Invalid Number');
  });

  it('should avoid shortening numbers if it is false', () => {
    expect(pipe.transform(1000000, false)).toBe('1,000,000');
  });

  it('should return formatted currency for small numbers', () => {
    expect(pipe.transform(123.456, false, 2)).toBe('123.46');
    expect(pipe.transform(-80, false)).toBe('-80');
    expect(pipe.transform(101.2546, false, 3)).toBe('101.255');
    expect(pipe.transform(101.2)).toBe('101.2');
    expect(pipe.transform(101.223)).toBe('101.223');
  });

  it('should return formatted currency for large numbers with M, B, T suffix', () => {
    expect(pipe.transform(999999)).toBe('999,999');
    expect(pipe.transform(1000000)).toBe('1M');
    expect(pipe.transform(999999999)).toBe('999.9M');
    expect(pipe.transform(1000000000)).toBe('1B');
    expect(pipe.transform(999999999999)).toBe('999.9B');
    expect(pipe.transform(1000000000000)).toBe('1T');
    expect(pipe.transform('49,000,000')).toBe('49M');
  });

  it('should correctly handle negative values', () => {
    expect(pipe.transform(-1234567)).toBe('-1.2M');
    expect(pipe.transform(-999999999)).toBe('-999.9M');
    expect(pipe.transform(-1000000000)).toBe('-1B');
  });

  it('should return an empty string for null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should correctly format very large numbers', () => {
    expect(pipe.transform(12345678901234)).toBe('12.3T');
  });

  it('should handle zero correctly', () => {
    expect(pipe.transform(0)).toBe('0');
  });
});
