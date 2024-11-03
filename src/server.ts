import type { FastifyInstance } from 'fastify';
import buildInstance from './app';
import autoloadOptions from './swappable-options/autoload-options';
import { cacheOptions } from './swappable-options/cache-options';
import { serverOptions } from './swappable-options/server-options';

const fastifyApp: FastifyInstance = buildInstance(serverOptions, autoloadOptions, cacheOptions);

fastifyApp.ready().then(() => {
  fastifyApp.listen({ host: '0.0.0.0', port: fastifyApp.config.APP_PORT }).catch((err) => {
    fastifyApp.log.error(err);
    process.exit(1);
  });
});
