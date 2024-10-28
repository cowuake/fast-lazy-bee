import type { FastifyInstance } from 'fastify';
import { buildInstance } from './app';
import autoloadOptions from './options/autoload-options';
import { serverOptions } from './options/server-options';

const fastifyApp: FastifyInstance = buildInstance(serverOptions, autoloadOptions, {});

fastifyApp.ready().then(() => {
  fastifyApp.listen({ host: '0.0.0.0', port: fastifyApp.config.APP_PORT }).catch((err) => {
    fastifyApp.log.error(err);
    process.exit(1);
  });
});
