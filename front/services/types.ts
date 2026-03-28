export type AuthUser = {
  id: string;
  email: string;
};

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
