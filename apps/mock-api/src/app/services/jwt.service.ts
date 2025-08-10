import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  /**
   * Generate short-lived JWT tokens
   * - accessToken: 20 seconds expiry
   * - refreshToken: 60 seconds expiry
   */
  generateTokens(payload: Record<string, unknown>): { accessToken: string; refreshToken: string; expiresIn: number } {
    const accessToken = this.jwt.sign(payload, { expiresIn: '5m' });
    const refreshToken = this.jwt.sign({ sub: payload?.sub || payload?.username || 'user' }, { expiresIn: '15m' });
    return { accessToken, refreshToken, expiresIn: 300 };
  }

  verifyToken<T extends object = Record<string, unknown>>(token: string): T {
    return this.jwt.verify<T>(token);
  }

  refreshAccessToken(refreshToken: string): string | null {
    try {
      // Throws if invalid or expired
      this.jwt.verify(refreshToken);
      const decoded = (this.jwt.decode(refreshToken) || {}) as Record<string, unknown>;
      const subject = decoded?.sub || 'user';
      return this.jwt.sign({ sub: subject as string }, { expiresIn: '15m' });
    } catch {
      return null;
    }
  }
}
