import { clearTokensFromStorage, loadTokensFromStorage, saveTokensToStorage } from './token-utils';

describe('Token Utils', () => {
  const STORAGE_KEY = 'auth_tokens';
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};
    const localStorageMock = {
      getItem: (key: string) => mockLocalStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockLocalStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockLocalStorage[key];
      },
      clear: () => {
        mockLocalStorage = {};
      },
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  describe('loadTokensFromStorage', () => {
    it('returns emptyTokens if localStorage has no value', () => {
      const result = loadTokensFromStorage();
      expect(result).toEqual({
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        issuedAtMs: 0,
      });
    });

    it('returns parsed tokens if localStorage has valid JSON', () => {
      const tokens = { accessToken: 'a', refreshToken: 'b', expiresIn: 123, issuedAtMs: 456 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
      const result = loadTokensFromStorage();
      expect(result).toEqual(tokens);
    });

    it('returns emptyTokens if localStorage has invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json');
      const result = loadTokensFromStorage();
      expect(result).toEqual({
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        issuedAtMs: 0,
      });
    });

    it('returns emptyTokens if localStorage.getItem throws', () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('fail');
          },
        },
      });
      const result = loadTokensFromStorage();
      expect(result).toEqual({
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        issuedAtMs: 0,
      });
    });

    it('returns emptyTokens if localStorage is undefined', () => {
      Object.defineProperty(window, 'localStorage', { value: undefined });
      const result = loadTokensFromStorage();
      expect(result).toEqual({
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        issuedAtMs: 0,
      });
    });

    it('returns emptyTokens if JSON.parse throws (jest.spyOn)', () => {
      localStorage.setItem(STORAGE_KEY, '"valid-but-will-throw"');
      const parseSpy = jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error('parse error');
      });

      const result = loadTokensFromStorage();
      expect(result).toEqual({
        accessToken: '',
        refreshToken: '',
        expiresIn: 0,
        issuedAtMs: 0,
      });

      parseSpy.mockRestore();
    });
  });

  describe('saveTokensToStorage', () => {
    it('saves tokens to localStorage', () => {
      const tokens = { accessToken: 'test', refreshToken: 'refresh', expiresIn: 3600, issuedAtMs: Date.now() };
      saveTokensToStorage(tokens);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(tokens);
    });
  });

  describe('clearTokensFromStorage', () => {
    it('removes tokens from localStorage', () => {
      const tokens = { accessToken: 'test', refreshToken: 'refresh', expiresIn: 3600, issuedAtMs: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
      expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();

      clearTokensFromStorage();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
