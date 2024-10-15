import type { RouteOptions } from 'fastify';
import { HttpMethods, HttpStatusCodes } from './enums';

export const genOptionsRoute = (url: string, tags: string[], allowString: string): RouteOptions => {
  return {
    method: HttpMethods.OPTIONS,
    url,
    schema: {
      tags,
      response: {
        [HttpStatusCodes.NoContent]: {
          description: 'No Content'
        }
      }
    },
    handler: async function options(_, reply) {
      reply.header('Allow', allowString).code(HttpStatusCodes.NoContent);
      reply.send(HttpStatusCodes.NoContent);
    }
  };
};
