import type { TSchema } from '@sinclair/typebox';
import type { HttpStatusCodes } from './enums';
import { HttpCodesToDescriptions } from './records';

const createResponseSchema = <T extends TSchema>(
  statusCode: HttpStatusCodes,
  schema: T
): Partial<Record<HttpStatusCodes, T>> => ({
  [statusCode]: { ...schema, description: HttpCodesToDescriptions[statusCode] }
});

export { createResponseSchema };
