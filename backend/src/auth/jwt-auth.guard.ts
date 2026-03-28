import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { USER_ROLE, type UserRole } from '../common/user-role';
import type { JwtUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  /** Cookie (ex. Swagger na mesma origem) ou `Authorization: Bearer` (ex. front noutro domínio). */
  private extractToken(req: Request): string | null {
    const auth = req.headers.authorization;
    if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
      const t = auth.slice(7).trim();
      if (t.length > 0) return t;
    }
    if (typeof req.cookies !== 'object' || req.cookies === null) {
      return null;
    }
    const jar = req.cookies as Record<string, unknown>;
    const v = jar['token'];
    if (typeof v === 'string' && v.length > 0) return v;
    return null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Token ausente');
    }
    try {
      const payload = await this.jwt.verifyAsync<
        Pick<JwtUser, 'sub' | 'email'> & { typeUser?: UserRole }
      >(token);
      const user: JwtUser = {
        sub: payload.sub,
        email: payload.email,
        typeUser: payload.typeUser ?? USER_ROLE.user,
      };
      (req as Request & { user: JwtUser }).user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
