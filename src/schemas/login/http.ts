import type { FastifySchema } from 'fastify';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { createErrorResponseSchemas, createJsonResponseSchema } from '../../utils/routing-utils';
import { UserSchema } from '../users/data';
import { JwtSchema } from './data';

const LoginSchema: FastifySchema = {
  summary: 'Generate login data for the user',
  body: UserSchema,
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, JwtSchema),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.InternalServerError
    ])
  }
};

export { LoginSchema };
