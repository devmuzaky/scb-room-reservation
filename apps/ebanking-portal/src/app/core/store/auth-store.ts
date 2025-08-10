import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { clearTokensFromStorage, loadTokensFromStorage, saveTokensToStorage, Tokens } from '../utils/token-utils';

export type Role = 'SUPER_USER' | 'MAKER' | 'CHECKER_LEVEL_1' | 'CHECKER_LEVEL_2' | 'CHECKER_LEVEL_3' | 'VIEWER';
export interface User {
  username: string;
  email: string;
  roles: Role[];
  companyName: string;
  cif: string;
  softTokenId: string;
  softTokenSerial: string;
  softTokenStatus: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export interface AuthInterface {
  user: User;
  tokens: Tokens;
}

const initialUser: User = {
  username: '',
  email: '',
  roles: [],
  companyName: '',
  cif: '',
  softTokenId: '',
  softTokenSerial: '',
  softTokenStatus: 'INACTIVE',
};

const initialTokens: Tokens = loadTokensFromStorage();

export const initialAuthState: AuthInterface = {
  user: initialUser,
  tokens: initialTokens,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthInterface>(initialAuthState),
  withComputed(store => ({
    isAuthenticated: computed(() => {
      const tokens = store.tokens();
      return !!tokens?.accessToken;
    }),
    isSessionExpired: computed(() => {
      const tokens = store.tokens();
      if (!tokens?.accessToken) return true;
      const issuedAtMs = tokens.issuedAtMs ?? 0;
      const ttlSeconds = tokens.expiresIn ?? 0;
      if (!issuedAtMs || !ttlSeconds) return true;
      const now = Date.now();
      const expiresAtMs = issuedAtMs + ttlSeconds * 1000;
      return now >= expiresAtMs;
    }),
  })),
  withMethods(store => ({
    setProfileInfo(user: User) {
      patchState(store, { user });
    },
    setTokens(tokens: Tokens) {
      // Save to localStorage
      const withIssued = { ...tokens, issuedAtMs: Date.now() } as Tokens;
      saveTokensToStorage(withIssued);
      patchState(store, { tokens: withIssued });
    },
    clearAuthState() {
      // Clear from localStorage
      clearTokensFromStorage();
      patchState(store, initialAuthState);
    },
  })),
);
