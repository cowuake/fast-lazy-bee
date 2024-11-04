import { ObjectId } from '@fastify/mongodb';
import type { FastifyInstance } from 'fastify';
import buildInstance from '../../app';
import autoloadOptions from '../../swappable-options/autoload-options';
import { serverOptions } from '../../swappable-options/server-options';
import { TestConstants } from '../constants/constants';

class TestServer {
  private static instance: FastifyInstance | null = null;

  public static getInstance(): FastifyInstance {
    if (this.instance === null) {
      this.instance = buildInstance(serverOptions, autoloadOptions, {});

      beforeAll(async () => {
        await this.instance?.ready();
        await this.instance?.mongo.client.connect();
      }, TestConstants.longTimeout);

      beforeEach(async () => {
        const db = this.instance?.mongo.client.db();
        const movieCollection = db?.collection('movies');
        const movie = await movieCollection?.findOne({ _id: new ObjectId(TestConstants.magicId) });

        if (movie === null) {
          await db?.collection('movies').insertOne({
            _id: new ObjectId(TestConstants.magicId),
            ...TestConstants.testMovie
          });
        }
      });

      afterAll(async () => {
        await this.instance?.mongo.client.close();
        await this.instance?.close();
      });
    }

    return this.instance;
  }
}

export default TestServer;
