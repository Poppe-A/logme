import type { FIELD_WIDTH } from './constants';

export const FIELD_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
} as const;

export type FieldType = (typeof FIELD_TYPE)[keyof typeof FIELD_TYPE];

export type FieldWidth = keyof typeof FIELD_WIDTH;
