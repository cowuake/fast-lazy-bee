import fp from 'fastify-plugin';
import fastifySwagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import pkg from '../../package.json';
import { RouteTags } from '../utils/constants/constants';

const swaggerOptions: FastifyDynamicSwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'FastLazyBee API',
      description: 'A sample API built with Fastify and TypeScript using MongoDB',
      version: pkg.version
    },
    tags: [
      { name: RouteTags.diagnostics, description: 'Diagnostics' },
      { name: RouteTags.movies, description: 'Movie Catalog' },
      { name: RouteTags.movie, description: 'Single Movies' },
      { name: RouteTags.comments, description: 'Movie Comments' },
      { name: RouteTags.cache, description: 'Cache-enabled routes' }
    ]
  },
  hideUntagged: false
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
