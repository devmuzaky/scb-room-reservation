import { injectService } from '@scb/util/testing';
import { AuthStore, User } from './auth-store';

describe('Auth store', () => {
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

  function setup() {
    const store = injectService(AuthStore);
    return store;
  }

  it('should patch user data', () => {
    const user = {
      username: 'testuser',
      email: 'email@test.com',
      roles: [],
      companyName: 'Test Company',
      cif: '123',
      softTokenId: '123',
      softTokenSerial: '123',
      softTokenStatus: 'ACTIVE',
    } satisfies User;
    const store = setup();

    store.setProfileInfo(user);
    expect(store.user()).toBe(user);
  });

  it('should load tokens from localStorage on initialization', () => {
    const storedTokens = {
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
      issuedAtMs: 0,
    };
    localStorage.setItem('auth_tokens', JSON.stringify(storedTokens));

    const store = setup();
    expect(store.tokens()).toEqual(storedTokens);
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorage.setItem('auth_tokens', 'invalid-json');

    const store = setup();
    expect(store.tokens()).toEqual({
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
      issuedAtMs: 0,
    });
  });

  it('should handle undefined or empty localStorage', () => {
    // Mock localStorage as undefined
    Object.defineProperty(window, 'localStorage', { value: undefined });

    const store = setup();
    expect(store.tokens()).toEqual({
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
      issuedAtMs: 0,
    });

    // Restore localStorage mock for other tests
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

  it('should save tokens to localStorage', () => {
    const store = setup();
    const tokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresIn: 3600,
      issuedAtMs: Date.now(),
    };

    store.setTokens(tokens);

    expect(store.tokens()).toEqual(tokens);
    expect(JSON.parse(localStorage.getItem('auth_tokens')!)).toEqual(tokens);
  });

  it('should clear tokens from localStorage', () => {
    const store = setup();
    const tokens = {
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      expiresIn: 3600,
      issuedAtMs: Date.now(),
    };

    // First set some tokens
    store.setTokens(tokens);
    expect(localStorage.getItem('auth_tokens')).toBeTruthy();

    // Then clear them
    store.clearAuthState();
    expect(localStorage.getItem('auth_tokens')).toBeNull();
    expect(store.tokens()).toEqual({
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
      issuedAtMs: 0,
    });
  });
});
