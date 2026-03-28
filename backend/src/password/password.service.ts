import { Injectable, NotFoundException } from '@nestjs/common';
import type { Password as PasswordRow } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { UserRole } from '../common/user-role';
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
  constructor(private readonly prisma: PrismaService) {}

  private toEntry(row: PasswordRow): PasswordEntry {
    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      username: row.username,
      secret: row.secret,
      notes: row.notes,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async create(userId: string, dto: CreatePasswordDto): Promise<PasswordEntry> {
    const row = await this.prisma.password.create({
      data: {
        userId,
        title: dto.title,
        username: dto.username ?? null,
        secret: dto.secret,
        notes: dto.notes ?? null,
      },
    });
    return this.toEntry(row);
  }

  async list(userId: string, typeUser: UserRole): Promise<PasswordEntry[]> {
    const rows = await this.prisma.password.findMany({
      where: typeUser === 'admin' ? {} : { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((r) => this.toEntry(r));
  }

  async getOne(
    userId: string,
    id: string,
    typeUser: UserRole,
  ): Promise<PasswordEntry> {
    const row = await this.prisma.password.findFirst({
      where: typeUser === 'admin' ? { id } : { id, userId },
    });
    if (!row) {
      throw new NotFoundException('Registro não encontrado');
    }
    return this.toEntry(row);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdatePasswordDto,
    typeUser: UserRole,
  ): Promise<PasswordEntry> {
    await this.getOne(userId, id, typeUser);
    const row = await this.prisma.password.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.username !== undefined && { username: dto.username || null }),
        ...(dto.secret !== undefined && { secret: dto.secret }),
        ...(dto.notes !== undefined && { notes: dto.notes || null }),
      },
    });
    return this.toEntry(row);
  }

  async delete(userId: string, id: string, typeUser: UserRole): Promise<void> {
    const result = await this.prisma.password.deleteMany({
      where: typeUser === 'admin' ? { id } : { id, userId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Registro não encontrado');
    }
  }
}
