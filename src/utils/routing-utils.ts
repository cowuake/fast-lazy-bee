import type { FastifyInstance } from 'fastify';
import { HttpMethods, HttpStatusCodes } from './enums';

export const genOptionsRoute = (
  fastify: FastifyInstance,
  url: string,
  tags: string[],
  allowString: string
): FastifyInstance => {
  return fastify.route({
    method: HttpMethods.OPTIONS,
    url,
    schema: {
      tags
    },
    handler: async function options(_, reply) {
      reply.header('Allow', allowString).code(HttpStatusCodes.NotFound);
    }
  });
};
