import { auditLogService } from "@modules/audit-log/audit-log.service";
import { HttpError } from "@modules/common/http-error";
import type { CreateCategoryInput } from "@modules/categories/category.types";
import { CategoryRepository } from "@modules/categories/category.repository";

export class CategoryService {
  constructor(private readonly categoryRepository = new CategoryRepository()) {}

  listAll() {
    return this.categoryRepository.listAll();
  }

  async create(input: CreateCategoryInput, userId: string) {
    const category = await this.categoryRepository.create(input);

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId,
      action: "category.create",
      entityType: "category",
      entityId: category.id,
      metadata: { name: category.name }
    });

    return category;
  }

  async delete(id: string, userId: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new HttpError(404, "Category not found");
    }

    await this.categoryRepository.softDelete(id);

    await auditLogService.write({
      timestamp: new Date().toISOString(),
      userId,
      action: "category.delete",
      entityType: "category",
      entityId: id,
      metadata: { name: category.name }
    });
  }
}

export const categoryService = new CategoryService();
