import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { ErrorSchemaType } from '../schemas/errors';
import { HttpStatusCodes } from '../utils/constants/enums';

const mapFastifyErrorToErrorSchemaType = (error: FastifyError): ErrorSchemaType => {
  return {
    status: error.statusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR,
    detail: error.message,
    code: error.code,
    errors: error.validation?.map((validationError) => ({
      detail: validationError.message ?? 'Validation error',
      pointer: validationError.instancePath
    }))
  };
};

const errorHandlingPlugin = fp(
  async (fastify: FastifyInstance) => {
    fastify.setErrorHandler(async (error: FastifyError, request, reply) => {
      fastify.log.error(error);
      const replyError: ErrorSchemaType = mapFastifyErrorToErrorSchemaType(error);
      reply.code(replyError.status).send(replyError);
    });
  },
  { name: 'error-handling' }
);

export default errorHandlingPlugin;
export { mapFastifyErrorToErrorSchemaType };
