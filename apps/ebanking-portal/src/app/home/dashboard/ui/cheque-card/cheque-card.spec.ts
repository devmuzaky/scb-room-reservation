import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { Cheque } from '../../widgets/cheque-out/model';
import { ChequeCard } from './cheque-card';

const layoutFacade = fakeService(LayoutFacadeService, () => {
  const language = signal('en' as AppLanguage);
  const isDarkTheme = signal(false);
  return {
    showBalances: signal(true),
    language,
    isDarkTheme,
    __: { language, isDarkTheme },
  };
});

describe('ChequeCard', () => {
  let view: RenderResult<ChequeCard>;
  let component: ChequeCard;

  beforeEach(async () => {
    view = await render(ChequeCard, [provideNoopAnimations(), provideTestTransloco(), layoutFacade]);
    component = view.host;
  });

  it('should create component', () => {
    expect(view.host).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should have cheque defined as input', () => {
    expect(component.cheque).toBeDefined();
  });

  it('approvalsDetail should be an instance of cheque', () => {
    const mockDetail: Cheque = {
      chequeSerialNumber: '123',
      chequeValue: 'reured',
      currency: 'USD',
      debitAccountNumber: 'AD21321321',
      date: 132121321,
    };

    Object.defineProperty(component, 'cheque', {
      value: mockDetail,
    });
    expect(component.cheque).toEqual(mockDetail);
  });

  it('should return true if language is Arabic', () => {
    layoutFacade._.language.set('ar');
    layoutFacade._.isDarkTheme.set(true);

    expect(component.isArabic()).toBe(true);
    expect(component.darkMode()).toBe(true);
  });

  it('should return false if language is not Arabic', () => {
    layoutFacade._.language.set('en');

    expect(component.isArabic()).toBe(false);
  });

  it('should return correct icon based on type and dark mode', () => {
    const testCases = [
      { type: 'deducted' as 'deducted' | 'returned', darkMode: true, expected: 'cheque-deducted-dark' },
      { type: 'deducted' as 'deducted' | 'returned', darkMode: false, expected: 'cheque-deducted' },
      { type: 'returned' as 'deducted' | 'returned', darkMode: true, expected: 'cheque-returned-dark' },
      { type: 'returned' as 'deducted' | 'returned', darkMode: false, expected: 'cheque-returned' },
      { type: undefined, darkMode: true, expected: '' },
      { type: undefined, darkMode: false, expected: '' },
    ];

    testCases.forEach(({ type, darkMode, expected }) => {
      view.setInput('type', type);
      layoutFacade._.isDarkTheme.set(darkMode);
      view.detectChanges();

      expect(component.chequeIcon()).toBe(expected);
    });
  });
});
