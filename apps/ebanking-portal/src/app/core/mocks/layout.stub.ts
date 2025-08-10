import { signal } from '@angular/core';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService } from '@scb/util/testing';

export const LayoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal<AppLanguage>('en'),
  mobileMode: signal(false),
  isDarkTheme: signal(false),
});
