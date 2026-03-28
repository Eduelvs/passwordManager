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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    // req.cookies é Record<string, any> em @types/cookie-parser
    const raw: unknown = req.cookies?.token;
    if (typeof raw !== 'string' || raw.length === 0) {
      throw new UnauthorizedException('Token ausente');
    }
    const token = raw;
    try {
      const payload = await this.jwt.verifyAsync<JwtUser>(token);
      (req as Request & { user: JwtUser }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
