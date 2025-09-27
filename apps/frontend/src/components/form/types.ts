export const FIELD_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
} as const;

export type FieldType = (typeof FIELD_TYPE)[keyof typeof FIELD_TYPE];
