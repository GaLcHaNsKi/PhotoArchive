import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

import type { AuditEvent } from "@modules/audit-log/audit-log.types";
import { env } from "@src/config/env";

export class AuditLogService {
  async write(event: AuditEvent) {
    const day = event.timestamp.slice(0, 10);
    const filePath = path.join(env.AUDIT_LOG_ROOT, `${day}.log`);

    await mkdir(path.dirname(filePath), { recursive: true });
    await appendFile(filePath, `${JSON.stringify(event)}\n`, "utf8");
  }
}

export const auditLogService = new AuditLogService();
