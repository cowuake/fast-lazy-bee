import type { FastifySchema } from 'fastify';
import { HttpMediaTypes, HttpStatusCodes, RouteTags } from '../../utils/constants/enums';
import { createErrorResponseSchemas } from '../../utils/routing-utils';
import { JwtSchema, UserSchema } from './data';

const LoginSchema: FastifySchema = {
  produces: [HttpMediaTypes.JSON],
  tags: [RouteTags.Auth],
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

const RegisterSchema: FastifySchema = {
  produces: [HttpMediaTypes.JSON],
  tags: [RouteTags.Auth],
  body: UserSchema,
  response: {
    [HttpStatusCodes.Created]: {},
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Conflict,
      HttpStatusCodes.InternalServerError
    ])
  }
};

export { LoginSchema, RegisterSchema };
