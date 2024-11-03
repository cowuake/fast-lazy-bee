import fastifySwagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import pkg from '../../package.json';
import { RouteTags, SecuritySchemes } from '../utils/constants/enums';

const swaggerOptions: FastifyDynamicSwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'FastLazyBee API',
      description: 'A sample API built with Fastify and TypeScript using MongoDB',
      version: pkg.version
    },
    tags: [
      { name: RouteTags.Diagnostics, description: '' },
      { name: RouteTags.Auth, description: '' },
      { name: RouteTags.Movies, description: '' },
      { name: RouteTags.Movie, description: '' },
      { name: RouteTags.Comments, description: '' },
      { name: RouteTags.Cache, description: '' }
    ],
    components: {
      securitySchemes: {
        [SecuritySchemes.BearerAuth]: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
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
