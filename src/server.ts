import { join } from 'node:path';
import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import Autoload, { type AutoloadPluginOptions } from '@fastify/autoload';

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
  dir: join(__dirname, 'routes'),
  autoHooks: true
};

const fastifyApp: FastifyInstance = fastify(serverOptions);

Promise.all([
  fastifyApp.register(Autoload, autoloadPluginsOptions),
  fastifyApp.register(Autoload, autoloadRoutesOptions)
]).then(() => {
  fastifyApp.listen({ host: '0.0.0.0', port: fastifyApp.config.APP_PORT }).catch((err) => {
    fastifyApp.log.error(err);
    process.exit(1);
  });
});
