import fp from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';
import type { FastifyInstance } from 'fastify';

const mongoPlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyMongo, {
      forceClose: true,
      url: fastify.config.MONGO_URL
    });
  },
  { dependencies: ['server-config'] }
);

export default mongoPlugin;
