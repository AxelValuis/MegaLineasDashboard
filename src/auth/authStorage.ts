const AUTH_TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => Boolean(getAuthToken());
