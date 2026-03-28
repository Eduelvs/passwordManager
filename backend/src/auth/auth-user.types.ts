import type { UserRole } from '../common/user-role';

/** Resultado de `user.create` / `findUnique` alinhado ao modelo `User` no Prisma. */
export type AuthUserRow = {
  id: string;
  email: string;
  passwordHash: string;
  typeUser: UserRole;
  createdAt: Date;
  updatedAt: Date;
};
