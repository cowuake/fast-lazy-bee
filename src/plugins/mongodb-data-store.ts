import fastifyMongo, { type FastifyMongodbOptions } from '@fastify/mongodb';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import setupMongoTestcontainers from '../utils/testing/setup-mongo-testcontainers';

const getMongoOptions = async (fastify: FastifyInstance): Promise<FastifyMongodbOptions> => {
  const commonOptions: FastifyMongodbOptions = {
    forceClose: true
  };

  if (fastify.config.NODE_ENV === 'test') {
    const mongoOptions = await setupMongoTestcontainers();
    return {
      ...commonOptions,
      ...mongoOptions
    };
  }

  return {
    ...commonOptions,
    url: fastify.config.MONGO_URL
  };
};

const mongoPlugin = fp(
  async (fastify: FastifyInstance) => {
    const mongoOptions = await getMongoOptions(fastify);
    await fastify.register(fastifyMongo, mongoOptions);
  },
  { name: 'mongo', dependencies: ['server-config'] }
);

export default mongoPlugin;
