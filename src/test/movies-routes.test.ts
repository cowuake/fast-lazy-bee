import type { FastifyInstance } from 'fastify';
import { buildTestInstance } from '../utils/test-utils';
import { HttpMethods, HttpStatusCodes } from '../utils/enums';

// const mongod: MongoMemoryServer = await MongoMemoryServer.create();
// const uri = mongod.getUri();
// const client: MongoClient = new MongoClient(uri);
// const db: Db = client.db();
// const movies: Collection<MovieSchemaType> = new Collection<MovieSchemaType>();

describe('movieApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const movieIdString = '573a1390f29313caabcd50e5';
  const baseUrl = '/mflix/movies';
  const idUrl = '/mflix/movies/:id';
  const allUrls = [baseUrl, idUrl];
  const testMovieProps = {
    title: 'Test Movie',
    type: 'movie',
    year: 2024
  };

  it('should be defined', () => {
    expect(fastifyInstance).toBeDefined();
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
      fastifyInstance
        .inject({
          method: HttpMethods.OPTIONS,
          url
        })
        .then((response) => {
          expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
          expect(response.headers).toHaveProperty('allow');
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });

  it('should fetch movies', () => {
    fastifyInstance
      .inject({
        method: HttpMethods.GET,
        url: `${baseUrl}?page=1&size=10`
      })
      .then((response) => {
        expect(response.statusCode).toBe(HttpStatusCodes.OK);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it('should create a movie', () => {
    fastifyInstance
      .inject({
        method: HttpMethods.POST,
        url: baseUrl,
        payload: testMovieProps
      })
      .then((response) => {
        expect(response.statusCode).toBe(HttpStatusCodes.Created);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it('should fetch a movie by id', () => {
    fastifyInstance
      .inject({
        method: HttpMethods.GET,
        url: `${baseUrl}/${movieIdString}`
      })
      .then((response) => {
        expect(response.statusCode).toBe(HttpStatusCodes.OK);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it('should replace a movie', () => {
    fastifyInstance
      .inject({
        method: HttpMethods.PUT,
        url: `${baseUrl}/${movieIdString}`,
        payload: testMovieProps
      })
      .then((response) => {
        expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it('should update a movie', () => {
    fastifyInstance
      .inject({
        method: HttpMethods.PATCH,
        url: `${baseUrl}/${movieIdString}`,
        payload: {
          type: 'movie'
        }
      })
      .then((response) => {
        expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  it('should delete a movie', () => {
    fastifyInstance
      .inject({
        method: HttpMethods.DELETE,
        url: `${baseUrl}/${movieIdString}`
      })
      .then((response) => {
        expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
