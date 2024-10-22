import fp from 'fastify-plugin';
import fastifySwagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import pkg from '../../package.json';
import { RouteTags } from '../utils/constants/constants';

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
      { name: RouteTags.movies, description: 'Movie operations' },
      { name: RouteTags.diagnostics, description: 'Health check operations' },
      { name: RouteTags.cache, description: 'Cacheable operations' }
    ]
  }
};

const swaggerUIOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    deepLinking: true,
    defaultModelExpandDepth: 10,
    syntaxHighlight: {
      activate: true,
      theme: 'nord'
    }
  }
};

const swaggerPlugin = fp(
  async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
      reply.redirect('/docs');
    });
    await fastify.register(fastifySwagger, swaggerOptions);
    await fastify.register(fastifySwaggerUi, swaggerUIOptions);
  },
  { name: 'swagger', dependencies: ['server-config'] }
);

export default swaggerPlugin;
