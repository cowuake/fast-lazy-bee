import type { FastifyInstance, RouteOptions } from 'fastify';
import { RouteTags } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url: '',
    schema: {
      tags: [RouteTags.diagnostics],
      response: {
        [HttpStatusCodes.OK]: {
          type: 'string'
        }
      }
    },
    handler: async (request, reply) => {
      return "I'm alive!";
    }
  }
];

const diagnosticsRoutes = async function (fastify: FastifyInstance): Promise<void> {
  routes.forEach((route) => {
    fastify.route(route);
  });
};

export default diagnosticsRoutes;
