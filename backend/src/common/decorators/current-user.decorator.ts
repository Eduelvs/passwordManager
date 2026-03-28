import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type JwtUser = { sub: string; email: string };

type RequestWithUser = { user?: JwtUser };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;
    if (user === undefined) {
      throw new Error('Request sem usuário autenticado');
    }
    return user;
  },
);
