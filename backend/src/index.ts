import { serve } from "@hono/node-server";

import { env } from "@src/config/env";
import { createApp } from "@src/app";

serve(
  {
    fetch: createApp().fetch,
    port: env.PORT
  },
  (info) => {
    console.log(`PhotoArchive API listening on http://localhost:${info.port}`);
  }
);