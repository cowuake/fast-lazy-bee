import type { FastifySchema } from 'fastify';
import { HttpMediaTypes, HttpStatusCodes } from '../../utils/constants/enums';
import { createErrorResponseSchemas } from '../../utils/routing-utils';
import { JwtSchema } from './data';

const LoginSchema: FastifySchema = {
  summary: 'Generate login data for the user',
  produces: [HttpMediaTypes.JSON],
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
