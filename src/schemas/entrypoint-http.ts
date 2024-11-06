import type { FastifySchema } from 'fastify';
import { HttpStatusCodes } from '../utils/constants/enums';
import { createErrorResponseSchemas, createJsonResponseSchema } from '../utils/routing-utils';
import { ResourceSchema, RootSchema } from './http';

const EntryPointSchema: FastifySchema = {
  summary: 'The entry point of the API',
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, ResourceSchema(RootSchema)),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

export { EntryPointSchema };
