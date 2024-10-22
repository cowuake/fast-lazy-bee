import type { TSchema } from '@sinclair/typebox';
import type { HttpStatusCodes } from './constants/enums';
import { HttpCodesToDescriptions } from './constants/records';

const createResponseSchema = <T extends TSchema>(
  statusCode: HttpStatusCodes,
  schema: T
): Partial<Record<HttpStatusCodes, T>> => ({
  [statusCode]: { ...schema, description: HttpCodesToDescriptions[statusCode] }
});

export { createResponseSchema };
