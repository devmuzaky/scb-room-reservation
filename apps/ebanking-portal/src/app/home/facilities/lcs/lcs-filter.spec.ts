import { provideTestTransloco } from '@/core/config/transloco.testing';
import { render, RenderResult } from '@scb/util/testing';
import { LcsFilter } from './lcs-filter.ng';
import { LcType } from './model';

describe('LCS Filter', () => {
  let view: RenderResult<LcsFilter>;

  beforeEach(async () => {
    view = await render(LcsFilter, [provideTestTransloco()]);
  });

  it('should create', () => {
    view.detectChanges();
    expect(view.host).toBeTruthy();
  });

  it('should clear filter', () => {
    view.host.clearFilter();
    expect(view.host.lcType()).toEqual([]);
  });

  it('should apply filter', () => {
    view.host._lcType.set(['LIDC']);
    view.host.apply();
    expect(view.host.lcType()).toEqual(['LIDC']);
  });

  it('should reset the values on dropdown closes', () => {
    view.host._lcType.set(['LIDC']);
    view.host.lcType.set([]);
    view.host.lcTypeClosed();
    expect(view.host._lcType()).toEqual([]);
  });

  describe('filterLCType function', () => {
    it('should return option value for filtering', () => {
      const mockOption: LcType = { key: 'LIDC', value: 'Letter of Credit' };
      const result = view.host.filterLCType(mockOption);
      expect(result).toBe('Letter of Credit');
    });

    it('should handle option with empty value', () => {
      const mockOption: LcType = { key: 'EMPTY', value: '' };
      const result = view.host.filterLCType(mockOption);
      expect(result).toBe('');
    });

    it('should handle option with null value', () => {
      const mockOption: LcType = { key: 'NULL', value: null as any };
      const result = view.host.filterLCType(mockOption);
      expect(result).toBe(null);
    });

    it('should handle option with undefined value', () => {
      const mockOption: LcType = { key: 'UNDEFINED', value: undefined as any };
      const result = view.host.filterLCType(mockOption);
      expect(result).toBe(undefined);
    });
  });

  describe('lcTypeClosed method', () => {
    it('should reset _lcType when lcType and _lcType are different', () => {
      // Set different values
      view.host.lcType.set(['LIDC']);
      view.host._lcType.set(['LISC']);

      view.host.lcTypeClosed();

      // Should reset _lcType to match lcType
      expect(view.host._lcType()).toEqual(['LIDC']);
    });

    it('should not reset _lcType when lcType and _lcType are equal', () => {
      // Set same values
      view.host.lcType.set(['LIDC']);
      view.host._lcType.set(['LIDC']);

      view.host.lcTypeClosed();

      // Should remain unchanged
      expect(view.host._lcType()).toEqual(['LIDC']);
    });

    it('should handle empty arrays when they are different', () => {
      // Set different values - one empty, one with data
      view.host.lcType.set([]);
      view.host._lcType.set(['LIDC']);

      view.host.lcTypeClosed();

      // Should reset _lcType to empty array
      expect(view.host._lcType()).toEqual([]);
    });

    it('should handle empty arrays when they are equal', () => {
      // Set same empty values
      view.host.lcType.set([]);
      view.host._lcType.set([]);

      view.host.lcTypeClosed();

      // Should remain empty
      expect(view.host._lcType()).toEqual([]);
    });

    it('should handle arrays with different order', () => {
      // Set same values but different order
      view.host.lcType.set(['LIDC', 'LISC']);
      view.host._lcType.set(['LISC', 'LIDC']);

      view.host.lcTypeClosed();

      // Should NOT reset _lcType because isEqual considers them equal
      expect(view.host._lcType()).toEqual(['LISC', 'LIDC']);
    });

    it('should handle arrays with different lengths', () => {
      // Set different lengths
      view.host.lcType.set(['LIDC']);
      view.host._lcType.set(['LIDC', 'LISC']);

      view.host.lcTypeClosed();

      // Should reset _lcType to match lcType
      expect(view.host._lcType()).toEqual(['LIDC']);
    });
  });
});
