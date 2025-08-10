import { render, RenderResult } from '@scb/util/testing';
import { CurrencyView } from './currency-view.ng';

describe('Currency View', () => {
  let view: RenderResult<CurrencyView>;

  beforeEach(async () => {
    view = await render(CurrencyView, [], {
      inputs: [['amount', 1000]],
    });
  });

  it('should create', () => {
    view.detectChanges();
    expect(view.host).toBeTruthy();
  });

  it('should handle emptyValue', () => {
    view.setInput('amount', undefined);
    view.setInput('currency', 'USD');
    view.detectChanges();

    expect(view.el.textContent?.trim()).toBe('');

    view.setInput('emptyValue', 'N/A');
    view.detectChanges();
    expect(view.el.textContent?.trim()).toBe('N/A');
  });

  it('should handle nonZero', () => {
    view.setInput('amount', 0);
    view.setInput('nonZero', true);
    view.setInput('currency', 'USD');
    view.detectChanges();

    expect(view.el.textContent?.trim()).toBe('');
  });
});
