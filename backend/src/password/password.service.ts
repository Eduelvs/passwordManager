import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

export type PasswordEntry = {
  id: string;
  userId: string;
  title: string;
  username: string | null;
  secret: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class PasswordService {
  private readonly byId = new Map<string, PasswordEntry>();

  create(userId: string, dto: CreatePasswordDto): PasswordEntry {
    const now = new Date().toISOString();
    const row: PasswordEntry = {
      id: crypto.randomUUID(),
      userId,
      title: dto.title,
      username: dto.username ?? null,
      secret: dto.secret,
      notes: dto.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.byId.set(row.id, row);
    return row;
  }

  list(userId: string): PasswordEntry[] {
    return [...this.byId.values()].filter((p) => p.userId === userId);
  }

  getOne(userId: string, id: string): PasswordEntry {
    const row = this.byId.get(id);
    if (!row) {
      throw new NotFoundException('Registro não encontrado');
    }
    if (row.userId !== userId) {
      throw new ForbiddenException();
    }
    return row;
  }

  update(userId: string, id: string, dto: UpdatePasswordDto): PasswordEntry {
    const row = this.getOne(userId, id);
    const next: PasswordEntry = {
      ...row,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.username !== undefined && { username: dto.username || null }),
      ...(dto.secret !== undefined && { secret: dto.secret }),
      ...(dto.notes !== undefined && { notes: dto.notes || null }),
      updatedAt: new Date().toISOString(),
    };
    this.byId.set(id, next);
    return next;
  }
}
