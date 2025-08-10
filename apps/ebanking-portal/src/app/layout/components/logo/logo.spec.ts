import { signal } from '@angular/core';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { render, RenderResult } from '@scb/util/testing';
import { Logo } from './logo';

const theme = signal(false);
const layoutFacadeServiceStub: Partial<LayoutFacadeService> = {
  isDarkTheme: theme,
};

describe('Logo Component', () => {
  let view: RenderResult<Logo>;

  beforeEach(async () => {
    view = await render(Logo, [{ provide: LayoutFacadeService, useValue: layoutFacadeServiceStub }]);
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should handle the image based on the theme', () => {
    theme.set(false);
    view.detectChanges();
    const eh = view.$<HTMLImageElement>('img');
    expect(eh.el.src).toContain('logo.svg');

    theme.set(true);
    view.detectChanges();
    expect(eh.el.src).toContain('logo-white.svg');
  });
});
