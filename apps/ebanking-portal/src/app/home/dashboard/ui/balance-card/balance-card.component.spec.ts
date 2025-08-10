import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { render, RenderResult } from '@scb/util/testing';
import { Currencies, CURRENCY_FLAG } from '../../model/constants';
import { AccountType, BalanceCardComponent } from './balance-card.component';

describe('BalanceCardComponent', () => {
  let view: RenderResult<BalanceCardComponent>;
  let component: BalanceCardComponent;
  let layoutFacade: { language: jest.Mock };
  beforeEach(async () => {
    view = await render(BalanceCardComponent, [provideNoopAnimations(), provideTestTransloco()]);
    component = view.host;
    layoutFacade = {
      language: jest.fn(),
    };
    component.layoutFacade = layoutFacade as any;
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should initialize currencyMap with countryCurrencyMap', () => {
    expect(component.currencyMap).toBe(CURRENCY_FLAG);
  });

  it('should initialize currencyEnum with Currencies', () => {
    expect(component.currencyEnum).toBe(Currencies);
  });

  it('should initialize accountOverviewType with AccountType', () => {
    expect(component.accountOverviewType).toBe(AccountType);
  });

  it('should return true if language is Arabic', () => {
    layoutFacade.language.mockReturnValue('ar');

    expect(component.isArabic()).toBe(true);
    expect(layoutFacade.language).toHaveBeenCalled();
  });

  it('should return false if language is not Arabic', () => {
    layoutFacade.language.mockReturnValue('en');

    expect(component.isArabic()).toBe(false);
    expect(layoutFacade.language).toHaveBeenCalled();
  });
});
