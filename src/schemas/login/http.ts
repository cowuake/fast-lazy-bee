import type { FastifySchema } from 'fastify';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { createErrorResponseSchemas } from '../../utils/routing-utils';
import { JwtSchema } from './data';

const LoginSchema: FastifySchema = {
  summary: 'Generate login data for the user',
  response: {
    [HttpStatusCodes.OK]: JwtSchema,
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.InternalServerError
    ])
  }
};

export { LoginSchema };
