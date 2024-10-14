import { join } from 'node:path';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import type { AutoloadPluginOptions } from '@fastify/autoload';
import { buildInstance } from './app';

const serverOptions: FastifyServerOptions = {
  caseSensitive: false,
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty'
    }
  }
};
const autoloadPluginsOptions: AutoloadPluginOptions = {
  dir: join(__dirname, 'plugins')
};
const autoloadRoutesOptions: AutoloadPluginOptions = {
  dir: join(__dirname, 'routes')
};

const fastifyApp: FastifyInstance = buildInstance(
  serverOptions,
  [autoloadPluginsOptions, autoloadRoutesOptions],
  {}
);

fastifyApp.listen({ host: '0.0.0.0', port: fastifyApp.config.APP_PORT }).catch((err) => {
  fastifyApp.log.error(err);
  process.exit(1);
});
