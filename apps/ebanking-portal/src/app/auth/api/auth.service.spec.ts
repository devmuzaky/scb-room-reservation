import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthStore } from '@/core/store/auth-store';
import { fakeService, injectService } from '@scb/util/testing';
import { AuthService } from './auth.service';

const httpStub = fakeService(HttpClient, {
  post: jest.fn(),
  get: jest.fn(),
});

const routerStub = fakeService(Router, {
  navigate: jest.fn(),
});

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 3600,
};

const authStoreStub = fakeService(AuthStore, {
  setTokens: jest.fn(),
  setProfileInfo: jest.fn(),
  clearAuthState: jest.fn(),
  tokens: signal(mockTokens).asReadonly() as any,
  user: signal({
    username: '',
    email: '',
    roles: [],
    companyName: '',
    cif: '',
  }).asReadonly() as any,
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = injectService(AuthService, [AuthService, httpStub, routerStub, authStoreStub]);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should handle login method', () => {
      const mockCaptcha = 'captcha token';
      const key = 'wwq112';
      const mockReq = { username: '123', password: '123' };
      const mockResponse = { accessToken: 'token', refreshToken: 'refresh', expiresIn: 3600 };
      (httpStub.v.post as jest.Mock).mockReturnValue(of(mockResponse));

      service.login(mockReq, mockCaptcha, key).subscribe();

      const params = new HttpParams().set('username', mockReq.username).set('password', mockReq.password);
      const body = params.toString();

      expect(httpStub.v.post).toHaveBeenCalledWith(
        '/api/authentication/auth/mobile/login',
        body,
        expect.objectContaining({
          headers: expect.any(HttpHeaders),
        }),
      );
      expect(authStoreStub.v.setTokens).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      const mockResponse = { accessToken: 'new-token', expiresIn: 3600 };
      (httpStub.v.post as jest.Mock).mockReturnValue(of(mockResponse));

      service.refreshToken().subscribe();

      expect(httpStub.v.post).toHaveBeenCalledWith('/api/authentication/auth/refresh', {
        refreshToken: mockTokens.refreshToken,
      });
      expect(authStoreStub.v.setTokens).toHaveBeenCalledWith({
        ...mockTokens,
        accessToken: mockResponse.accessToken,
        expiresIn: mockResponse.expiresIn,
      });
    });

    it('should handle refresh token error', () => {
      (httpStub.v.post as jest.Mock).mockReturnValue(throwError(() => new Error('Refresh failed')));

      service.refreshToken().subscribe({
        error: () => {
          expect(authStoreStub.v.clearAuthState).toHaveBeenCalled();
          expect(routerStub.v.navigate).toHaveBeenCalledWith(['/login']);
        },
      });
    });

    it('should handle missing refresh token', () => {
      const emptyTokens = { accessToken: '', refreshToken: '', expiresIn: 0 };
      authStoreStub.v.tokens = signal(emptyTokens).asReadonly() as any;

      service.refreshToken().subscribe({
        error: error => {
          expect(error.message).toBe('No refresh token available');
        },
      });
    });
  });

  describe('me', () => {
    it('should get user profile', () => {
      const mockUser = { id: 1, name: 'Test User' };
      (httpStub.v.get as jest.Mock).mockReturnValue(of(mockUser));

      service.me().subscribe();

      expect(httpStub.v.get).toHaveBeenCalledWith('/api/authentication/auth/me');
      expect(authStoreStub.v.setProfileInfo).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('logout', () => {
    it('should handle successful logout', () => {
      (httpStub.v.post as jest.Mock).mockReturnValue(of({}));

      service.logout().subscribe();

      expect(httpStub.v.post).toHaveBeenCalledWith('/api/authentication/auth/logout', {});
      expect(authStoreStub.v.clearAuthState).toHaveBeenCalled();
    });

    it('should handle logout error and still clear auth state', () => {
      const mockError = new Error('Logout failed');
      (httpStub.v.post as jest.Mock).mockReturnValue(throwError(() => mockError));

      service.logout().subscribe({
        error: error => {
          expect(error).toBe(mockError);
          expect(authStoreStub.v.clearAuthState).toHaveBeenCalled();
        },
      });
    });
  });

  describe('getRolesFromToken', () => {
    it('should return roles from valid JWT token', () => {
      const mockRoles = ['admin', 'user'];
      const payload = { realm_access: { roles: mockRoles } };
      const validToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      authStoreStub.v.tokens = signal({
        accessToken: validToken,
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual(mockRoles);
    });

    it('should return empty array when no access token', () => {
      authStoreStub.v.tokens = signal({
        accessToken: '',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual([]);
    });

    it('should return empty array when payload has no realm_access', () => {
      const payload = { someOtherProperty: 'value' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      authStoreStub.v.tokens = signal({
        accessToken: token,
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual([]);
    });

    it('should return empty array when realm_access has no roles', () => {
      const payload = { realm_access: { someOtherProperty: 'value' } };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      authStoreStub.v.tokens = signal({
        accessToken: token,
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual([]);
    });

    it('should return empty array when realm_access is null', () => {
      const payload = { realm_access: null };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      authStoreStub.v.tokens = signal({
        accessToken: token,
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual([]);
    });

    it('should return empty array when roles is null', () => {
      const payload = { realm_access: { roles: null } };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      authStoreStub.v.tokens = signal({
        accessToken: token,
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual([]);
    });

    it('should return empty array when JWT decoding fails', () => {
      const invalidToken = 'invalid.jwt.token';

      authStoreStub.v.tokens = signal({
        accessToken: invalidToken,
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual([]);
    });

    it('should return empty array when JWT has wrong format', () => {
      const malformedToken = 'header.payload'; // Missing signature part

      authStoreStub.v.tokens = signal({
        accessToken: malformedToken,
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      }).asReadonly() as any;

      const result = service.getRolesFromToken();

      expect(result).toEqual([]);
    });
  });
});
