// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { MongoClient, type Db, Collection } from 'mongodb';
import type { FastifyInstance } from 'fastify';
// import type { MovieSchemaType } from '../../../schemas/movies/data';
// import fastify from 'fastify';
import { buildTestInstance } from '../utils/test-utils';
import { HttpMethods, HttpStatusCodes } from '../utils/enums';
import { AppConfigDefaults } from '../utils/constants';

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
  const baseUrl = '/mflix/movies';
  const idUrl = '/mflix/movies/:id';
  const allUrls = [baseUrl, idUrl];

  it('should be defined', () => {
    expect(fastifyInstance).toBeDefined();
  });

  it('should access database', () => {
    expect(fastifyInstance.mongo.db).toBeDefined();
    expect(fastifyInstance.mongo.db).not.toBeNull();
    expect(fastifyInstance.config.MONGO_URL).toBe(AppConfigDefaults.mongoUrl);
    expect(
      fastifyInstance.mongo.db
        ?.listCollections()
        .toArray()
        .then((collections) => {
          const firstCollection = collections[0];
          expect(firstCollection.name).toBe('comments');
        })
    ).toBeDefined();
    // const collections = fastifyInstance.mongo.db.listCollections().toArray();
    // expect(collections).toBeDefined();
    // expect(Array.isArray(collections)).toBeTruthy();
  });

  it('should include all expected endpoints', () => {
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
    allUrls.forEach((url) => {
      fastifyInstance.inject(
        {
          method: HttpMethods.OPTIONS,
          url
        },
        (err, response) => {
          expect(err).toBeNull();
          expect(response).toBeDefined();
          expect(response?.statusCode).toBe(HttpStatusCodes.NoContent);
          expect(response?.headers).toHaveProperty('allow');
        }
      );
    });
  });

  it('should fetch movies', () => {
    fastifyInstance.inject(
      {
        method: HttpMethods.GET,
        url: `${baseUrl}?page=1&size=10`
      },
      (err, response) => {
        expect(err).toBeNull();
        expect(response).toBeDefined();
        expect(response?.statusCode).toBe(HttpStatusCodes.OK);
      }
    );
  });

  // it('should create a movie', () => {
  //   fastifyInstance.inject(
  //     {
  //       method: HttpMethods.POST,
  //       url: baseUrl,
  //       payload: {
  //         title: 'Test Movie',
  //         type: 'movie',
  //         year: 2024
  //       }
  //     },
  //     (err, response) => {
  //       expect(err).toBeNull();
  //       expect(response).toBeDefined();
  //       expect(response?.statusCode).toBe(HttpStatusCodes.Created);
  //     }
  //   );
  // });

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
