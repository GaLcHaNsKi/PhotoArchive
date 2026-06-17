import type { Prisma } from "@prisma/client";

import { prisma } from "@src/lib/prisma";

const authUserSelect = {
  id: true,
  username: true,
  passwordHash: true,
  role: true,
  isActive: true,
  lastLoginAt: true
} satisfies Prisma.UserSelect;

export class AuthRepository {
  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: authUserSelect
    });
  }

  updateLastLogin(userId: string, when: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: when },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true
      }
    });
  }
}
