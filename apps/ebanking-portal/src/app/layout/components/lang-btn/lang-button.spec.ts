import { signal } from '@angular/core';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { LangButton } from './lang-button';

const layoutFacadeStub = fakeService(LayoutFacadeService, () => {
  const language = signal<AppLanguage>('en');
  return {
    language,
    setLanguage: (lang: AppLanguage) => language.set(lang),
    __: { language },
  };
});

describe('LangButton Component', () => {
  let view: RenderResult<LangButton>;

  beforeEach(async () => {
    view = await render(LangButton, [layoutFacadeStub]);
  });

  it('should display "عربي" when language is "en"', () => {
    layoutFacadeStub._.language.set('en');
    view.detectChanges();

    expect(view.host.label()).toBe('عربي');
  });

  it('should display "EN" when language is "ar"', () => {
    layoutFacadeStub._.language.set('ar');
    view.detectChanges();

    expect(view.host.label()).toBe('EN');
  });

  it('should toggle language when button is clicked', () => {
    jest.spyOn(layoutFacadeStub.v, 'setLanguage');
    layoutFacadeStub._.language.set('en');
    view.host.toggleLang();
    view.detectChanges();
    expect(layoutFacadeStub.v.setLanguage).toHaveBeenCalledWith(layoutFacadeStub._.language());

    layoutFacadeStub._.language.set('ar');
    view.host.toggleLang();
    view.detectChanges();
    expect(layoutFacadeStub.v.setLanguage).toHaveBeenCalledWith(layoutFacadeStub._.language());
  });
});
