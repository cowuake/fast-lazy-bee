import fastify, { type FastifyServerOptions, type FastifyInstance } from 'fastify';
import Autoload, { type AutoloadPluginOptions } from '@fastify/autoload';
import fastifyCaching, { type FastifyCachingPluginOptions } from '@fastify/caching';

export const buildInstance = (
  serverOptions: FastifyServerOptions,
  autoloadPluginsOptions: AutoloadPluginOptions[],
  cachingOptions: FastifyCachingPluginOptions
): FastifyInstance => {
  const fastifyApp: FastifyInstance = fastify(serverOptions);

  for (const pluginOptions of autoloadPluginsOptions) {
    fastifyApp.register(Autoload, pluginOptions);
  }
  fastifyApp.register(fastifyCaching, cachingOptions);

  return fastifyApp;
};
