import type { UserRole } from "@prisma/client";

export type AuthContext = {
  userId: string;
  username: string;
  role: UserRole;
};
