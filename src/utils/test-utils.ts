import type { FastifyInstance } from 'fastify';
import { buildInstance } from '../app';
import { serverOptions } from '../options/server-options';
import autoloadOptions from '../options/autoload-options';
import { TestConstants } from '../utils/constants';
import { ObjectId } from '@fastify/mongodb';

function buildTestInstance(): FastifyInstance {
  const fastifyApp: FastifyInstance = buildInstance(serverOptions, autoloadOptions, {});

  beforeAll(async () => {
    await fastifyApp.ready();
  });

  beforeEach(async () => {
    const db = (fastifyApp.mongo.db = fastifyApp.mongo.client.db());
    const movieCollection = db.collection('movies');
    const movie = await movieCollection.findOne({ _id: new ObjectId(TestConstants.magicId) });

    if (movie === null) {
      await db.collection('movies').insertOne({
        _id: new ObjectId(TestConstants.magicId),
        ...TestConstants.testMovie
      });
    }
  });

  afterAll(async () => {
    await fastifyApp.close();
  });

  return fastifyApp;
}

export { buildTestInstance };
