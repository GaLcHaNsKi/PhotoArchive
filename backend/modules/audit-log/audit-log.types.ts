export type AuditEvent = {
  timestamp: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata?: Record<string, unknown>;
};
