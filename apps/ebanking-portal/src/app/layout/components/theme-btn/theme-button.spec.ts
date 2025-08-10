import { signal } from '@angular/core';
import { provideTestTransloco } from '@/config/transloco.testing';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ThemeMode } from '@scb/util/theme';
import { ThemeButton } from './theme-button';

const layoutFacadeStub = fakeService(LayoutFacadeService, () => {
  const isDarkTheme = signal(true);
  return {
    isDarkTheme,
    changeTheme: (theme: ThemeMode) => isDarkTheme.set(theme === 'dark'),
    __: { isDarkTheme },
  };
});

describe('ThemeButton Component', () => {
  let view: RenderResult<ThemeButton>;

  beforeEach(async () => {
    view = await render(ThemeButton, [layoutFacadeStub, provideTestTransloco()]);
  });

  it('should set checked signal based on isDarkTheme value', () => {
    view.detectChanges();
    expect(view.host.checked()).toBe(true);
  });

  it('should call onChange method when the switch is toggled', () => {
    jest.spyOn(layoutFacadeStub.v, 'changeTheme');
    const onChangeSpy = jest.spyOn(view.host, 'onChange');
    view.detectChanges();
    const switchComponent = view.$('button');
    switchComponent.click();
    view.detectChanges();

    expect(onChangeSpy).toHaveBeenCalled();
    expect(layoutFacadeStub.v.changeTheme).toHaveBeenCalledWith('light');

    switchComponent.click();
    view.detectChanges();

    expect(onChangeSpy).toHaveBeenCalled();
    expect(layoutFacadeStub.v.changeTheme).toHaveBeenCalledWith('dark');
  });
});
