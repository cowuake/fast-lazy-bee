import type { FastifyInstance } from 'fastify';
import { buildInstance } from '../app';
import { serverOptions } from '../options/server-options';
import autoloadOptions from '../options/autoload-options';
import { TestConstants } from './constants';
import { ObjectId } from '@fastify/mongodb';

export function buildTestInstance(): FastifyInstance {
  const fastifyApp: FastifyInstance = buildInstance(serverOptions, autoloadOptions, {});

  beforeAll(async () => {
    await fastifyApp.ready();

    const db = (fastifyApp.mongo.db = fastifyApp.mongo.client.db());
    const movieCollection = db.collection('movies');
    const testMovieThere =
      (await movieCollection.findOne({ _id: new ObjectId(TestConstants.magicId) })) !== null;
    if (!testMovieThere) {
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
