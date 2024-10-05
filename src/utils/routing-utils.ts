import { FastifyInstance } from 'fastify';

export const genOptionsRoute = (
  fastify: FastifyInstance,
  url: string,
  tags: string[],
  allowString: string
) => {
  fastify.route({
    method: 'OPTIONS',
    url,
    schema: {
      tags
    },
    handler: async function options(_, reply) {
      reply.header('Allow', allowString).code(204);
    }
  });
};
