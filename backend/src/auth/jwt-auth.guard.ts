import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
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
    const c = req.cookies?.token;
    if (typeof c === 'string' && c.length > 0) return c;
    return null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Token ausente');
    }
    try {
      const payload = await this.jwt.verifyAsync<JwtUser>(token);
      (req as Request & { user: JwtUser }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
