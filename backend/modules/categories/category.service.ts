import { auditLogService } from "@modules/audit-log/audit-log.service";
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
      metadata: { slug: category.slug }
    });

    return category;
  }
}

export const categoryService = new CategoryService();
