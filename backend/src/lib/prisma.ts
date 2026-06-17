import { PrismaClient } from "@prisma/client";

declare global {
  var __photoArchivePrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__photoArchivePrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__photoArchivePrisma = prisma;
}
