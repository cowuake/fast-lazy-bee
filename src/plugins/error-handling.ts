import type { FastifyError, FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { HttpStatusCodes } from '../utils/enums';
import type { ErrorSchemaType } from '../schemas/errors';

function mapFastifyErrorToErrorSchemaType(
  error: FastifyError,
  request: FastifyRequest
): ErrorSchemaType {
  return {
    status: error.statusCode ?? HttpStatusCodes.InternalServerError,
    type: error.name,
    detail: error.message,
    code: error.code
    // errors:
    //   error.validation !== undefined
    //     ? error.validation.map((validationError) => ({
    //         detail: validationError.message
    //       }))
    //     : undefined
  };
}

const errorHandlingPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(async (error: FastifyError, request, reply) => {
    fastify.log.error(error);
    const replyError: ErrorSchemaType = mapFastifyErrorToErrorSchemaType(error, request);
    reply.code(replyError.status).send(replyError);
  });
});

export default errorHandlingPlugin;
