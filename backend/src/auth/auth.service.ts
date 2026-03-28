import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import type { UserRole } from '../common/user-role';
import type { AuthUserRow } from './auth-user.types';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const passwordHash = await hash(dto.password, 10);
    try {
      const user = (await this.prisma.user.create({
        data: { email, passwordHash },
      })) as AuthUserRow;
      const accessToken = await this.signUser(
        user.id,
        user.email,
        user.typeUser,
      );
      return {
        accessToken,
        user: { id: user.id, email: user.email, typeUser: user.typeUser },
      };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = (await this.prisma.user.findUnique({
      where: { email },
    })) as AuthUserRow | null;
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const accessToken = await this.signUser(user.id, user.email, user.typeUser);
    return {
      accessToken,
      user: { id: user.id, email: user.email, typeUser: user.typeUser },
    };
  }

  private signUser(id: string, email: string, typeUser: UserRole) {
    return this.jwt.signAsync({ sub: id, email, typeUser });
  }
}
