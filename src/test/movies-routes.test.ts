// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { MongoClient, type Db, Collection } from 'mongodb';
import type { FastifyInstance } from 'fastify';
// import type { MovieSchemaType } from '../../../schemas/movies/data';
// import fastify from 'fastify';
import { buildTestInstance } from '../utils/test-utils';
import { HttpMethods } from '../utils/enums';

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

  it('should include all expected endpoints', () => {
    const baseUrl = '/mflix/movies';
    const idUrl = '/mflix/movies/:id';
    const allUrls = [baseUrl, idUrl];

    allUrls.forEach((url) => {
      expect(fastifyInstance.hasRoute({ method: HttpMethods.GET, url })).toBeTruthy();
      expect(fastifyInstance.hasRoute({ method: HttpMethods.OPTIONS, url })).toBeTruthy();
    });

    expect(fastifyInstance.hasRoute({ method: HttpMethods.POST, url: baseUrl })).toBeTruthy();
    expect(fastifyInstance.hasRoute({ method: HttpMethods.PUT, url: idUrl })).toBeTruthy();
    expect(fastifyInstance.hasRoute({ method: HttpMethods.PATCH, url: idUrl })).toBeTruthy();
    expect(fastifyInstance.hasRoute({ method: HttpMethods.DELETE, url: idUrl })).toBeTruthy();
  });

  it('should return the available HTTP methods', () => {
    fastifyInstance.inject(
      {
        method: 'OPTIONS',
        url: '/mflix/movies'
      },
      (err, response) => {
        expect(err).toBeNull();
        expect(response).toBeDefined();
        expect(response?.statusCode).toBe(204);
      }
    );
  });

  it('should fetch movies', () => {
    fastifyInstance.inject(
      {
        method: 'GET',
        url: '/mflix/movies?page=1&size=10'
      },
      (err, response) => {
        expect(err).toBeNull();
        expect(response).toBeDefined();
        expect(response?.statusCode).toBe(200);
      }
    );
  });

  it('should create a movie', () => {
    fastifyInstance.inject(
      {
        method: 'POST',
        url: '/mflix/movies',
        payload: {
          title: 'Test Movie',
          type: 'movie',
          year: 2021
        }
      },
      (err, response) => {
        expect(err).toBeNull();
        expect(response).toBeDefined();
        expect(response?.statusCode).toBe(201);
      }
    );
  });

  // it('should fetch a movie by id', () => {
  //   fastifyInstance.inject(
  //     {
  //       method: 'GET',
  //       url: '/mflix/movies/1'
  //     },
  //     (err, response) => {
  //       expect(err).toBeNull();
  //       expect(response).toBeDefined();
  //       expect(response?.statusCode).toBe(200);
  //     }
  //   );
  // });
});
