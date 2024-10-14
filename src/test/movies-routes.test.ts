// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { MongoClient, type Db, Collection } from 'mongodb';
import type { FastifyInstance } from 'fastify';
// import type { MovieSchemaType } from '../../../schemas/movies/data';
// import fastify from 'fastify';
import { buildTestInstance } from '../utils/test-utils';

// const mongod: MongoMemoryServer = await MongoMemoryServer.create();
// const uri = mongod.getUri();
// const client: MongoClient = new MongoClient(uri);
// const db: Db = client.db();
// const movies: Collection<MovieSchemaType> = new Collection<MovieSchemaType>();

// before(async () => {
//   await fastifyInstance.register(movieAutoHooks);
//   await fastifyInstance.ready();
// });

// beforeAll(async () => {
//   // await mongod.start();
//   // await client.connect();
// });

// afterAll(async () => {
//   // await client.close();
//   // await mongod.stop();
// });

describe('movieApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();

  it('should be defined', () => {
    expect(fastifyInstance).toBeDefined();
  });

  test('should be defined', () => {
    fastifyInstance.inject(
      {
        method: 'GET',
        url: '/mflix/movies?page=1&size=10'
      },
      (err, response) => {
        expect(err).toBeNull();
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
      }
    );
  });
});
