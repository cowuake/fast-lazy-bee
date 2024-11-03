import type { FastifySchema } from 'fastify';
import { HttpMediaTypes, HttpStatusCodes } from '../../utils/constants/enums';
import { createErrorResponseSchemas } from '../../utils/routing-utils';
import { UserSchema } from '../users/data';
import { JwtSchema } from './data';

const LoginSchema: FastifySchema = {
  produces: [HttpMediaTypes.JSON],
  body: UserSchema,
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
