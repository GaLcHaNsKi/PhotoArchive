import { apiFetch } from "@modules/api/client";
import type { CategorySummary } from "@modules/categories/types";

type CategoryListResponse = { items: CategorySummary[] };

export const fetchCategories = () => apiFetch<CategoryListResponse>("/categories");
