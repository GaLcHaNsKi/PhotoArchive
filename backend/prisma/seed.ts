import path from "node:path";

import argon2 from "argon2";
import dotenv from "dotenv";
import { UserRole } from "@prisma/client";

import { prisma } from "@src/lib/prisma";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

const rootUsername = process.env.ROOT_USERNAME ?? "root";
const rootPassword = process.env.ROOT_PASSWORD ?? "root123456";

const main = async () => {
  if (rootPassword.length < 8) {
    throw new Error("ROOT_PASSWORD must be at least 8 characters to match login validation");
  }

  const passwordHash = await argon2.hash(rootPassword);
  const existing = await prisma.user.findUnique({
    where: { username: rootUsername },
    select: { id: true }
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        role: UserRole.root,
        isActive: true
      }
    });

    console.log(`Root user updated: ${rootUsername}`);
    return;
  }

  await prisma.user.create({
    data: {
      username: rootUsername,
      passwordHash,
      role: UserRole.root,
      isActive: true
    }
  });

  console.log(`Root user created: ${rootUsername}`);
};

main()
  .catch((error) => {
    console.error("Root seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
