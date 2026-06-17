import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { userService } from "@modules/users/user.service";
import { createAdminSchema } from "@modules/users/user.types";

export class UserController {
  createAdmin = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const payload = parseOrThrow(createAdminSchema, await c.req.json());
    const user = await userService.createAdmin(payload, auth.userId);
    return c.json({ user }, 201);
  };
}

export const userController = new UserController();
