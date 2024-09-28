import fp from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';
import { FastifyInstance } from 'fastify';

module.exports = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyMongo, {
      forceClose: true,
      url: fastify.config.MONGO_URL
    });
  },
  { dependencies: ['server-config'] }
);
