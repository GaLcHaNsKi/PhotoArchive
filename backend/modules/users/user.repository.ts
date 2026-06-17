import type { Prisma } from "@prisma/client";

import { prisma } from "@src/lib/prisma";

const userSelect = {
  id: true,
  username: true,
  role: true,
  isActive: true,
  lastLoginAt: true
} satisfies Prisma.UserSelect;

export class UserRepository {
  findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: userSelect
    });
  }

  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: userSelect
    });
  }

  createAdmin(input: { username: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        username: input.username,
        passwordHash: input.passwordHash,
        role: "admin",
        isActive: true
      },
      select: userSelect
    });
  }
}
