import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { HttpStatusCodes } from '../utils/enums';

module.exports = fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);
    reply.code(HttpStatusCodes.InternalServerError).send({
      code: HttpStatusCodes.InternalServerError,
      message: 'Internal Server Error',
      error: error.message
    });
  });
});
