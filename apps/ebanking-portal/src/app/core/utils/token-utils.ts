export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  /** Epoch milliseconds when tokens were saved/issued on client */
  issuedAtMs?: number;
}

const STORAGE_KEY = 'auth_tokens';

const emptyTokens: Tokens = {
  accessToken: '',
  refreshToken: '',
  expiresIn: 0,
  issuedAtMs: 0,
};

export const loadTokensFromStorage = (): Tokens => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : emptyTokens;
  } catch {
    return emptyTokens;
  }
};

export const saveTokensToStorage = (tokens: Tokens): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

export const clearTokensFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
