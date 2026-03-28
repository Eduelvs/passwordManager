import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { getAuthCookieOptions } from '../common/cookie-options';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastro' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.auth.register(dto);
    res.cookie('token', accessToken, getAuthCookieOptions());
    return { user, accessToken };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.auth.login(dto);
    res.cookie('token', accessToken, getAuthCookieOptions());
    return { user, accessToken };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout (remove o cookie)' })
  logout(@Res({ passthrough: true }) res: Response) {
    const opts = getAuthCookieOptions();
    res.clearCookie('token', {
      path: opts.path ?? '/',
      sameSite: opts.sameSite,
      secure: opts.secure,
    });
    return { ok: true };
  }
}
