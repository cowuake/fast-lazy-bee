import { ObjectId } from '@fastify/mongodb';
import type { FastifyInstance } from 'fastify';
import buildInstance from '../../app';
import autoloadOptions from '../../swappable-options/autoload-options';
import { serverOptions } from '../../swappable-options/server-options';
import { TestConstants } from '../constants/constants';

function buildTestInstance(): FastifyInstance {
  const fastifyApp: FastifyInstance = buildInstance(serverOptions, autoloadOptions, {});
  beforeAll(async () => {
    await fastifyApp.ready();
    await fastifyApp.mongo.client.connect();
  }, TestConstants.longTimeout);
  beforeEach(async () => {
    const db = fastifyApp.mongo.client.db();
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
    await fastifyApp.mongo.client.close();
    await fastifyApp.close();
  });

  return fastifyApp;
}

export default buildTestInstance;
