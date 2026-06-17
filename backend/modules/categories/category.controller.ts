import type { AuthContext } from "@modules/common/auth-context";
import { parseOrThrow } from "@modules/common/validation";
import { categoryService } from "@modules/categories/category.service";
import { createCategorySchema } from "@modules/categories/category.types";

export class CategoryController {
  list = async (c: any) => {
    const items = await categoryService.listAll();
    return c.json({ items });
  };

  create = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const payload = parseOrThrow(createCategorySchema, await c.req.json());
    const category = await categoryService.create(payload, auth.userId);
    return c.json({ category }, 201);
  };

  delete = async (c: any) => {
    const auth = c.get("auth") as AuthContext;
    const id = c.req.param("id") as string;
    await categoryService.delete(id, auth.userId);
    return c.json({ success: true });
  };
}

export const categoryController = new CategoryController();
