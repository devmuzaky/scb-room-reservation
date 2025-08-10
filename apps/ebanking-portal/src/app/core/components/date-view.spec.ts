import { DatePipe } from '@angular/common';
import { signal } from '@angular/core';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { DateView } from './date-view.ng';

const layoutStub = fakeService(LayoutFacadeService, () => {
  const language = signal<AppLanguage>('en');
  return {
    language,
    __: { language },
  };
});

const arDate = '24 مايو 2024';
const datePipeStub = fakeService(DatePipe, {
  transform: (
    value: Date | string | number | null | undefined,
    format?: string,
    timezone?: string,
    locale?: string,
  ) => {
    if (locale === 'ar-EG') {
      return arDate;
    }
    return '24 Aug 2024' as any;
  },
});

describe('Date View', () => {
  let view: RenderResult<DateView>;

  beforeEach(async () => {
    view = await render(DateView, [layoutStub], {
      inputs: [['value', '2024-08-24']],
      providers: [datePipeStub],
    });
  });

  it('should create', () => {
    view.detectChanges();
    expect(view.host).toBeTruthy();
  });

  it('should handle language change', () => {
    view.detectChanges();
    expect(view.host.output()).toBe('24 Aug 2024');
    layoutStub._.language.set('ar');
    view.detectChanges();
    expect(view.host.output()).toBe(arDate);
  });

  describe('convertToDate method', () => {
    it('should convert DD-MM-YYYY format to ISO string', () => {
      const result = view.host.convertToDate('24-08-2024');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      const parsedDate = new Date(result!);
      expect(parsedDate.toString()).not.toBe('Invalid Date');
    });

    it('should return undefined for undefined input', () => {
      const result = view.host.convertToDate(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = view.host.convertToDate('');
      expect(result).toBeUndefined();
    });

    it('should handle invalid date format gracefully', () => {
      expect(() => {
        view.host.convertToDate('invalid-date');
      }).toThrow('Invalid time value');
    });
  });

  describe('output computed property - istFormat branch', () => {
    it('should convert date when istFormat is true and value exists', () => {
      view.setInput('istFormat', true);
      view.setInput('value', '24-08-2024');
      view.detectChanges();
      expect(view.host.output()).toBe('24 Aug 2024');
    });

    it('should not convert date when istFormat is false', () => {
      view.setInput('istFormat', false);
      view.setInput('value', '24-08-2024');
      view.detectChanges();
      expect(view.host.output()).toBe('24 Aug 2024');
    });

    it('should not convert date when istFormat is true but value is undefined', () => {
      view.setInput('istFormat', true);
      view.setInput('value', undefined);
      view.detectChanges();
      expect(view.host.output()).toBe('');
    });

    it('should not convert date when istFormat is true but value is 0', () => {
      view.setInput('istFormat', true);
      view.setInput('value', 0);
      view.detectChanges();
      expect(view.host.output()).toBe('');
    });
  });
});
