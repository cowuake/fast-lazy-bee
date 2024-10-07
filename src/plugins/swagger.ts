import fp from 'fastify-plugin';
import fastifySwagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import pkg from '../../package.json';

const swaggerOptions: FastifyDynamicSwaggerOptions = {
  swagger: {
    info: {
      title: 'FastLazyBee API',
      description: 'A sample API built with Fastify and TypeScript using MongoDB',
      version: pkg.version
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      {
        name: 'Diagnostics'
      },
      {
        name: 'Movies'
      }
    ]
  }
};

const swaggerUIOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs'
};

module.exports = fp(
  async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
      reply.redirect('/docs');
    });
    await fastify.register(fastifySwagger, swaggerOptions);
    await fastify.register(fastifySwaggerUi, swaggerUIOptions);
  },
  { dependencies: ['server-config'] }
);
