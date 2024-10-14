import type { FastifyInstance } from 'fastify';
import { buildInstance } from '../app';
import { serverOptions } from '../options/server-options';
import autoloadOptions from '../options/autoload-options';

export function buildTestInstance(): FastifyInstance {
  const fastifyApp: FastifyInstance = buildInstance(serverOptions, autoloadOptions, {});

  beforeAll(async () => {
    await fastifyApp.ready();
  });

  afterAll(async () => {
    await fastifyApp.close();
  });

  return fastifyApp;
}
