import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ShellItem } from './side-menu-item';

const layoutServiceStub = fakeService(LayoutFacadeService, {});

describe('ShellItem', () => {
  let view: RenderResult<ShellItem>;

  let component: ShellItem;

  beforeEach(async () => {
    view = await render(ShellItem, [provideTestTransloco(), provideRouter([]), layoutServiceStub]);

    component = view.host;
  });

  it('should be created and set iconName', () => {
    view.setInput('activeIcon', 'home-solid');
    view.setInput('icon', 'home');
    view.setInput('href', '/dashboard');
    view.setInput('sideMenu', '/dashboard');

    expect(component).toBeTruthy();
    expect(component.iconName()).toBeDefined();
  });

  it('should set iconName when icon is provided and not active', () => {
    view.setInput('icon', 'profile-2user');
    view.setInput('href', '/beneficiary');
    view.setInput('sideMenu', '/beneficiary');

    expect(component.sideMenu()).toBeDefined();
  });

  it('should set iconName when icon is provided and  active', () => {
    view.setInput('icon', 'profile-2user');
    view.setInput('href', '/accounts-and-deposits');
    view.setInput('sideMenu', '/dashboard/accounts-and-deposits');

    expect(component.iconName()).toBeDefined();
  });
});
