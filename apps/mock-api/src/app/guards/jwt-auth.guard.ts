import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();

      // Check for Authorization header
      const authHeader = request.headers['authorization'] || request.headers['Authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.logger.error('No valid Authorization header found');
        throw new UnauthorizedException('No JWT token found in Authorization header');
      }

      const token = authHeader.substring(7);
      if (!token) {
        throw new UnauthorizedException('No JWT token found in Authorization header');
      }

      // Verify token (will throw if invalid or expired)
      const decoded = this.jwtService.verifyToken(token);
      // attach basic user info for downstream handlers
      request.user = decoded || { username: 'corp100', companyName: 'ALMUGHRABI', cif: '01102757' };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Authentication error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
