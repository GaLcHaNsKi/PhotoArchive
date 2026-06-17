import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { userService } from "@modules/users/user.service";
import { changePasswordSchema, createAdminSchema, resetPasswordSchema } from "@modules/users/user.types";

export class UserController {
  createAdmin = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const payload = parseOrThrow(createAdminSchema, await c.req.json());
    const user = await userService.createAdmin(payload, auth.userId);
    return c.json({ user }, 201);
  };

  changeOwnPassword = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const payload = parseOrThrow(changePasswordSchema, await c.req.json());
    await userService.changeOwnPassword(auth.userId, payload);
    return c.json({ success: true });
  };

  resetUserPassword = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const targetId = c.req.param("id") as string;
    const payload = parseOrThrow(resetPasswordSchema, await c.req.json());
    await userService.resetPassword(targetId, payload, auth.userId);
    return c.json({ success: true });
  };

  listAdmins = async (c: any) => {
    const items = await userService.listAdmins();
    return c.json({ items });
  };
}

export const userController = new UserController();
