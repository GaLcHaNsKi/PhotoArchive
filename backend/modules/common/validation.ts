import { ZodSchema } from "zod";

import { HttpError } from "@modules/common/http-error";

export const parseOrThrow = <T>(schema: ZodSchema<T>, payload: unknown): T => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new HttpError(400, "Validation failed", result.error.flatten());
  }

  return result.data;
};
