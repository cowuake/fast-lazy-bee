import fastifySwagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import pkg from '../../package.json';
import { SecuritySchemes } from '../utils/constants/enums';
import { RouteTagsToDescriptions } from '../utils/constants/records';

const shortDescription =
  'A toy RESTful Web API built with Fastify and TypeScript for educational purposes';

const swaggerOptions: FastifyDynamicSwaggerOptions = {
  mode: 'dynamic',
  openapi: {
    info: {
      title: 'FastLazyBee API',
      summary: shortDescription,
      description: shortDescription,
      version: pkg.version,
      license: {
        identifier: 'MIT',
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    externalDocs: {
      url: 'https://github.com/cowuake/fast-lazy-bee',
      description: 'Find more info here (GitHub repository)'
    },
    tags: Object.entries(RouteTagsToDescriptions).map(([name, description]) => ({
      name,
      description
    })),
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
