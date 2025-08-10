import { injectService } from '@scb/util/testing';
import { DashboardStore } from './dashboard.store';

describe('DashboardStore', () => {
  function setup() {
    const store = injectService(DashboardStore);
    return store;
  }

  it('should patch user data', () => {
    const sample = ['USD', 'EUR'];
    const store = setup();

    expect(store.currencyList()).toStrictEqual({ accounts: [], certificates: [], deposits: [] });
    store.setCurrencyList('accounts', ['USD', 'EUR']);
    expect(store.currencyList()).toStrictEqual({ accounts: ['USD', 'EUR'], certificates: [], deposits: [] });
  });
});
