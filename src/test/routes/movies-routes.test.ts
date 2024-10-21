import type { FastifyInstance } from 'fastify';
import buildTestInstance from '../../utils/testing/build-test-instance';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import { TestConstants } from '../../utils/constants/constants';

describe('movieApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const baseUrl = '/mflix/movies';
  const idUrl = '/mflix/movies/:id';
  const pagination = 'page=1&size=10';
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
      url: `${baseUrl}?${pagination}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should filter movies by title', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${baseUrl}?${pagination}&title=alien`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should filter movies by year', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${baseUrl}?${pagination}&year=1979`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should sort movies', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${baseUrl}?${pagination}&sort=awards:desc,year:asc,title:asc`
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

  it(`should return a ${HttpStatusCodes.NotFound} when fetching a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${baseUrl}/${TestConstants.fakeId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should replace a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${baseUrl}/${testMovieId}`,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when replacing a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${baseUrl}/${TestConstants.fakeId}`,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
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

  it(`should return a ${HttpStatusCodes.NotFound} when updating a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: `${baseUrl}/${TestConstants.fakeId}`,
      payload: {
        type: 'movie'
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should delete a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${baseUrl}/${testMovieId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when deleting a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${baseUrl}/${TestConstants.fakeId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });
});
