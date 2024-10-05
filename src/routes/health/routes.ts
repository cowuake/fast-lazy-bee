import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { HttpMethods } from '../../utils/enums';

const routes: Array<RouteOptions> = [
  {
    method: HttpMethods.GET,
    url: '',
    schema: {
      tags: ['Diagnostics'],
      response: {
        200: {
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
