import type { FastifyInstance, RouteOptions } from 'fastify';
import { HttpMethods, HttpStatusCodes, RouteTags } from '../../utils/constants/enums';
import { registerEndpointRoutes } from '../../utils/routing-utils';

const endpoint = '';
const tags: RouteTags[] = [RouteTags.Diagnostics] as const;

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url: endpoint,
    schema: {
      tags,
      response: {
        [HttpStatusCodes.OK]: {
          type: 'string'
        }
      }
    },
    handler: async (request, reply) => {
      return "I'm alive!";
    }
  } as const
] as const;

const diagnosticsRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, routes);
};

export default diagnosticsRoutes;
