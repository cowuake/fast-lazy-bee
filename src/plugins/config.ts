import fp from 'fastify-plugin';
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env';
import { FastifyInstance } from 'fastify';
import { EnvSchema } from '../schemas/dotenv';

const configOptions: FastifyEnvOptions = {
  confKey: 'config',
  schema: EnvSchema,
  dotenv: true,
  data: process.env
};

module.exports = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyEnv, configOptions);
  },
  { name: 'server-config' }
);
