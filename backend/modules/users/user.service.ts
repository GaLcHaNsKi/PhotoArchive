import argon2 from "argon2";

import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import type { ChangePasswordInput, CreateAdminInput, ResetPasswordInput } from "@modules/users/user.types";
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

  async changeOwnPassword(userId: string, input: ChangePasswordInput) {
    const user = await this.userRepository.findByIdWithHash(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const valid = await argon2.verify(user.passwordHash, input.currentPassword);

    if (!valid) {
      throw new HttpError(400, "Current password is incorrect");
    }

    const newHash = await argon2.hash(input.newPassword);
    await this.userRepository.updatePasswordHash(userId, newHash);

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId,
      action: "user.change_password",
      entityType: "user",
      entityId: userId,
      metadata: {}
    });
  }

  async resetPassword(targetId: string, input: ResetPasswordInput, requesterId: string) {
    const target = await this.userRepository.findById(targetId);

    if (!target) {
      throw new HttpError(404, "User not found");
    }

    const newHash = await argon2.hash(input.newPassword);
    await this.userRepository.updatePasswordHash(targetId, newHash);

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId: requesterId,
      action: "user.reset_password",
      entityType: "user",
      entityId: targetId,
      metadata: { username: target.username }
    });
  }

  listAdmins() {
    return this.userRepository.listAdmins();
  }
}

export const userService = new UserService();
