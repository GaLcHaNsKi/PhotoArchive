import argon2 from "argon2";

import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import type { CreateAdminInput } from "@modules/users/user.types";
import { UserRepository } from "@modules/users/user.repository";

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async createAdmin(input: CreateAdminInput, createdBy: string) {
    const existing = await this.userRepository.findByUsername(input.username);

    if (existing) {
      throw new HttpError(409, "Username already exists");
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await this.userRepository.createAdmin({
      username: input.username,
      passwordHash
    });

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId: createdBy,
      action: "user.create_admin",
      entityType: "user",
      entityId: user.id,
      metadata: { username: user.username }
    });

    return user;
  }
}

export const userService = new UserService();
