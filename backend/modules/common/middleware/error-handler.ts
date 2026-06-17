import type { Context } from "hono";

import { HttpError } from "@modules/common/http-error";

export const handleAppError = (error: Error, c: Context) => {
  if (error instanceof HttpError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.details ?? null
      }),
      {
        status: error.statusCode,
        headers: {
          "content-type": "application/json"
        }
      }
    );
  }

  console.error(error);
  return c.json({ error: "Internal server error" }, 500);
};
