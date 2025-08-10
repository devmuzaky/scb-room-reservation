import { Component } from '@angular/core';
import { provideTestTransloco } from '@/config/transloco.testing';
import { TranslocoService } from '@jsverse/transloco';
import { StorageService } from '@scb/util/storage';
import { render, RenderResult } from '@scb/util/testing';
import { LayoutFacadeService } from './layout.facade.service';

@Component({
  template: `<div id="testid"></div>`,
})
class TestComponent {}

describe('LayoutFacadeService', () => {
  let view: RenderResult<TestComponent>;
  let facadeService: LayoutFacadeService;
  let storageService: StorageService;

  beforeEach(async () => {
    // Mock storage service to return undefined for language (default to 'en')
    const mockStorageService = {
      get: jest.fn().mockReturnValue(undefined),
      set: jest.fn(),
    };

    view = await render(TestComponent, [
      LayoutFacadeService,
      provideTestTransloco() as any,
      { provide: StorageService, useValue: mockStorageService },
    ]);
    facadeService = view.inject(LayoutFacadeService);
    storageService = view.inject(StorageService);
  });

  function html() {
    return view.queryRoot('html');
  }

  it('service created', () => {
    expect(facadeService).toBeTruthy();
  });

  it('should have the theme values', () => {
    expect(facadeService.isDarkTheme()).toBeFalsy();
    expect(facadeService.isLightTheme()).toBeTruthy();
    expect(html().hasClass('light')).toBeTruthy();

    facadeService.changeTheme('dark');

    expect(facadeService.isDarkTheme()).toBeTruthy();
    expect(facadeService.isLightTheme()).toBeFalsy();
    expect(html().hasClass('dark')).toBeTruthy();
  });

  it('should have the language and update it properly', () => {
    const translocoService = view.inject(TranslocoService);
    jest.spyOn(translocoService, 'setActiveLang');
    expect(facadeService.language()).toBe('en');

    facadeService.setLanguage('ar');
    expect(translocoService.setActiveLang).toHaveBeenCalledWith('ar');

    expect(facadeService.language()).toBe('ar');
  });

  it('should handle the language direction properly', () => {
    facadeService.setLanguage('en');
    expect(html().attr('dir')).not.toBe('rtl');

    facadeService.setLanguage('ar');
    expect(html().attr('dir')).toBe('rtl');
  });

  it('should toggle balances', () => {
    facadeService.toggleBalances();
    expect(facadeService.showBalances()).toBeFalsy();

    facadeService.toggleBalances();
    expect(facadeService.showBalances()).toBeTruthy();
  });

  it('should have correct language computed properties', () => {
    // Test initial state (English)
    expect(facadeService.language()).toBe('en');
    expect(facadeService.isEnglish()).toBeTruthy();
    expect(facadeService.isArabic()).toBeFalsy();

    // Test Arabic language
    facadeService.setLanguage('ar');
    expect(facadeService.language()).toBe('ar');
    expect(facadeService.isEnglish()).toBeFalsy();
    expect(facadeService.isArabic()).toBeTruthy();

    // Test back to English
    facadeService.setLanguage('en');
    expect(facadeService.language()).toBe('en');
    expect(facadeService.isEnglish()).toBeTruthy();
    expect(facadeService.isArabic()).toBeFalsy();
  });

  it('should initialize with stored language or default to English', () => {
    // Verify storage service was called to get language
    expect(storageService.get).toHaveBeenCalledWith('language');

    // Since we mocked it to return undefined, it should default to 'en'
    expect(facadeService.language()).toBe('en');
  });

  it('should handle setCanLeave and getCanLeave', () => {
    // Test initial state
    expect(facadeService.getCanLeave()).toBeTruthy();

    // Test setting canLeave to false
    facadeService.setCanLeave(false);
    expect(facadeService.getCanLeave()).toBeFalsy();

    // Test setting canLeave to true
    facadeService.setCanLeave(true);
    expect(facadeService.getCanLeave()).toBeTruthy();

    // Test setting canLeave to false again
    facadeService.setCanLeave(false);
    expect(facadeService.getCanLeave()).toBeFalsy();
  });

  it('should save language to storage when changed', () => {
    // Change language to Arabic
    facadeService.setLanguage('ar');

    // Verify it was saved to storage
    expect(storageService.set).toHaveBeenCalledWith('language', 'ar');

    // Change language to English
    facadeService.setLanguage('en');

    // Verify it was saved to storage
    expect(storageService.set).toHaveBeenCalledWith('language', 'en');
  });

  describe('layout Service', () => {
    it('should toggle the show value', () => {
      expect(facadeService.show()).toBeTruthy();

      facadeService.toggle();
      expect(facadeService.show()).toBeFalsy();
    });

    it('should handle the iconMode properly', () => {
      expect(facadeService.iconMode()).toBeFalsy();

      facadeService.mode.set('partial');
      expect(facadeService.iconMode()).toBeFalsy();
      facadeService.toggle();
      expect(facadeService.iconMode()).toBeTruthy();
    });

    it('should handle breakpoint observer override', () => {
      facadeService['state'].set({ md: true });
      expect(facadeService.mode()).toBe('over');
    });

    it('should handle breakpoint observer override when it is mobile screen', () => {
      facadeService['bpMobileState'].set({ sm: true });
      expect(facadeService.mobileMode()).toBe(true);
    });

    it('should handle breakpoint observer override when it is mobile screen', () => {
      facadeService['bpMobileState'].set({ sm: false });
      expect(facadeService.mobileMode()).toBe(false);
    });

    it('should handle itemClick when mode is over', () => {
      // Set mode to 'over'
      facadeService['state'].set({ md: true });
      expect(facadeService.mode()).toBe('over');

      // Set show to true initially
      facadeService.show.set(true);
      expect(facadeService.show()).toBeTruthy();

      // Call itemClick
      facadeService.itemClick();

      // Should set show to false when mode is 'over'
      expect(facadeService.show()).toBeFalsy();
    });

    it('should not change show state when itemClick is called in partial mode', () => {
      // Set mode to 'partial'
      facadeService['state'].set({ md: false });
      expect(facadeService.mode()).toBe('partial');

      // Set show to true initially
      facadeService.show.set(true);
      expect(facadeService.show()).toBeTruthy();

      // Call itemClick
      facadeService.itemClick();

      // Should not change show state when mode is 'partial'
      expect(facadeService.show()).toBeTruthy();
    });

    it('should not change show state when itemClick is called and show is already false', () => {
      // Set mode to 'over'
      facadeService['state'].set({ md: true });
      expect(facadeService.mode()).toBe('over');

      // Set show to false initially
      facadeService.show.set(false);
      expect(facadeService.show()).toBeFalsy();

      // Call itemClick
      facadeService.itemClick();

      // Should remain false
      expect(facadeService.show()).toBeFalsy();
    });
  });
});
