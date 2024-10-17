import fp from 'fastify-plugin';
import fastifyEnv, { type FastifyEnvOptions } from '@fastify/env';
import type { FastifyInstance } from 'fastify';
import { EnvSchema } from '../schemas/dotenv';

const configOptions: FastifyEnvOptions = {
  confKey: 'config',
  schema: EnvSchema,
  dotenv: true,
  data: process.env
};

const configPlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyEnv, configOptions);
  },
  { name: 'server-config' }
);

export default configPlugin;
