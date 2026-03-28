import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type UserRow = { id: string; email: string; passwordHash: string };

@Injectable()
export class AuthService {
  private readonly usersByEmail = new Map<string, UserRow>();

  constructor(private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const key = dto.email.toLowerCase();
    if (this.usersByEmail.has(key)) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const passwordHash = await hash(dto.password, 10);
    const user: UserRow = {
      id: crypto.randomUUID(),
      email: dto.email,
      passwordHash,
    };
    this.usersByEmail.set(key, user);
    const accessToken = await this.signUser(user);
    return { accessToken, user: { id: user.id, email: user.email } };
  }

  async login(dto: LoginDto) {
    const key = dto.email.toLowerCase();
    const user = this.usersByEmail.get(key);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const accessToken = await this.signUser(user);
    return { accessToken, user: { id: user.id, email: user.email } };
  }

  private signUser(user: UserRow) {
    return this.jwt.signAsync({ sub: user.id, email: user.email });
  }
}
