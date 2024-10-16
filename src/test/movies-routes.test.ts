import type { FastifyInstance } from 'fastify';
import { buildTestInstance } from '../utils/test-utils';
import { HttpMethods, HttpStatusCodes } from '../utils/enums';
import { TestConstants } from '../utils/constants';

// const mongod: MongoMemoryServer = await MongoMemoryServer.create();
// const uri = mongod.getUri();
// const client: MongoClient = new MongoClient(uri);
// const db: Db = client.db();
// const movies: Collection<MovieSchemaType> = new Collection<MovieSchemaType>();

describe('movieApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const baseUrl = '/mflix/movies';
  const idUrl = '/mflix/movies/:id';
  const allUrls = [baseUrl, idUrl];

  const testMovieId = TestConstants.magicId;
  const testMovie = TestConstants.testMovie;

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

  it('should return the available HTTP methods', async () => {
    for (const url of allUrls) {
      const response = await fastifyInstance.inject({
        method: HttpMethods.OPTIONS,
        url
      });
      expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
      expect(response.headers).toHaveProperty('allow');
    }
  });

  it('should fetch movies', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${baseUrl}?page=1&size=10`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should create a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: baseUrl,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Created);
  });

  it('should fetch a movie by id', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${baseUrl}/${testMovieId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should replace a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${baseUrl}/${testMovieId}`,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it('should update a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: `${baseUrl}/${testMovieId}`,
      payload: {
        type: 'movie'
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it('should delete a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${baseUrl}/${testMovieId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });
});
