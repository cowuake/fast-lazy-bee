import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { HttpMethods } from '../utils/constants/enums';

const allowedMethods = [HttpMethods.OPTIONS, HttpMethods.GET, HttpMethods.HEAD].map((method) =>
  method.valueOf()
);

const authenticationPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, { secret: 'supersecret' });

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.addHook('onRequest', async (request, reply) => {
    if (
      allowedMethods.includes(request.method) ||
      request.url.includes('/login') ||
      request.url.includes('/register')
    ) {
      return;
    }
    await request.jwtVerify();
  });
});

export default authenticationPlugin;
