export const AppErrorCodes = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  DB_CONSTRAINT: 'DB_CONSTRAINT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  // domain-specific
  USR_EMAIL_DUPLICATE: 'USR_EMAIL_DUPLICATE',
} as const;
export type AppErrorCode = (typeof AppErrorCodes)[keyof typeof AppErrorCodes];
