import type { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { HttpMethods, HttpStatusCodes } from '../../utils/enums';

const routes: RouteOptions[] = [
  {
    method: HttpMethods.GET,
    url: '',
    schema: {
      tags: ['Diagnostics'],
      response: {
        [HttpStatusCodes.OK]: {
          type: 'string'
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return "I'm alive!";
    }
  }
];

module.exports = async function testRoutes(fastify: FastifyInstance) {
  routes.forEach((route) => {
    fastify.route(route);
  });
};
