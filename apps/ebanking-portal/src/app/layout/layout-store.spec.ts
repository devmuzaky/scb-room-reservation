import { injectService } from '@scb/util/testing';
import { LayoutStore } from './layout-store';

describe('Layout store', () => {
  function setup() {
    const store = injectService(LayoutStore);
    return store;
  }

  it('should patch theme data', () => {
    const store = setup();

    expect(store.theme()).toBe('dark');
    store.setTheme('light');
    expect(store.theme()).toBe('light');
  });

  it('should handle lang data', () => {
    const store = setup();

    expect(store.language()).toBe('en');
    store.setAppLanguage('ar');
    expect(store.language()).toBe('ar');
  });
});
