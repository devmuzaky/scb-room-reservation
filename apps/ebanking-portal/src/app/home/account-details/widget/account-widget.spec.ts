import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { render, RenderResult } from '@scb/util/testing';
import { AccountBasicDetailWidget } from './account-details-widget';

describe('Account Widget Component', () => {
  let component: AccountBasicDetailWidget;
  let view: RenderResult<AccountBasicDetailWidget>;

  beforeEach(async () => {
    view = await render(AccountBasicDetailWidget, [provideNoopAnimations(), provideTestTransloco()]);
    view.detectChanges();
    component = view.host;
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should have default status as "loading"', () => {
    expect(component.status()).toBe('loading');
  });

  it('should emit reload event', () => {
    const emitSpy = jest.spyOn(component.reload, 'emit');
    component.reload.emit();
    expect(emitSpy).toHaveBeenCalled();
  });
});
