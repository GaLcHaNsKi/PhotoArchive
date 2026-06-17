import argon2 from "argon2";
import { SignJWT } from "jose";

import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import { UserRepository } from "@modules/users/user.repository";
import type { LoginInput } from "@modules/auth/auth.types";
import { AuthRepository } from "@modules/auth/auth.repository";
import { env } from "@src/config/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export class AuthService {
  constructor(
    private readonly authRepository = new AuthRepository(),
    private readonly userRepository = new UserRepository()
  ) {}

  async login(input: LoginInput) {
    const user = await this.authRepository.findByUsername(input.username);

    if (!user || !user.isActive) {
      throw new HttpError(401, "Invalid username or password");
    }

    const passwordMatches = await argon2.verify(user.passwordHash, input.password);

    if (!passwordMatches) {
      throw new HttpError(401, "Invalid username or password");
    }

    const loginAt = new Date();
    const safeUser = await this.authRepository.updateLastLogin(user.id, loginAt);
    const sessionToken = await new SignJWT({
      userId: safeUser.id,
      username: safeUser.username,
      role: safeUser.role
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);
    const csrfToken = crypto.randomUUID();

    await auditLogService.write({
      timestamp: loginAt.toISOString(),
      userId: safeUser.id,
      action: "auth.login",
      entityType: "user",
      entityId: safeUser.id,
      metadata: { username: safeUser.username }
    });

    return {
      user: safeUser,
      sessionToken,
      csrfToken
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return user;
  }

  async logout(userId: string | null) {
    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId,
      action: "auth.logout",
      entityType: "user",
      entityId: userId,
      metadata: {}
    });
  }
}

export const authService = new AuthService();
