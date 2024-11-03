import type { FastifySchema } from 'fastify';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { createErrorResponseSchemas } from '../../utils/routing-utils';
import { UserSchema } from './data';

const CreateUserSchema: FastifySchema = {
  summary: 'Create a new user',
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

export { CreateUserSchema };
