import type { FastifyInstance } from 'fastify';
import { TestConstants } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import buildTestInstance from '../../utils/testing/build-test-instance';

describe('API', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const moviesEndpoint = `${TestConstants.v1Root}/movies`;
  const movieIdEndpoint = `${moviesEndpoint}/:movie_id`;
  const pagination = 'page=1&size=10';
  const allUrls = [moviesEndpoint, movieIdEndpoint];

  const testMovieId = TestConstants.magicId;
  const testMovie = TestConstants.testMovie;

  it('should rely on a defined Fastify instance', () => {
    expect(fastifyInstance).toBeDefined();
  });

  it('should include all expected endpoints', () => {
    allUrls.forEach((url) => {
      expect(fastifyInstance.hasRoute({ method: HttpMethods.GET, url })).toBeTruthy();
      expect(fastifyInstance.hasRoute({ method: HttpMethods.OPTIONS, url })).toBeTruthy();
    });

    expect(
      fastifyInstance.hasRoute({ method: HttpMethods.POST, url: moviesEndpoint })
    ).toBeTruthy();
    expect(
      fastifyInstance.hasRoute({ method: HttpMethods.PUT, url: movieIdEndpoint })
    ).toBeTruthy();
    expect(
      fastifyInstance.hasRoute({ method: HttpMethods.PATCH, url: movieIdEndpoint })
    ).toBeTruthy();
    expect(
      fastifyInstance.hasRoute({ method: HttpMethods.DELETE, url: movieIdEndpoint })
    ).toBeTruthy();
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
      url: `${moviesEndpoint}?${pagination}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should filter movies by title', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}&search=title:alien`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should filter movies by year', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}&search=year:1979`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should filter movies by several properties', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}&search=title:alien,year=1979`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should sort movies', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}&sort=awards:desc,year:asc,title:asc`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should create a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: moviesEndpoint,
      payload: { ...testMovie, year: 1899 }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Created);
  });

  it('should report a conflict when trying to create a movie replica', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: moviesEndpoint,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Conflict);
  });

  it('should fetch a movie by id', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}/${testMovieId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when fetching a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should replace a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${moviesEndpoint}/${testMovieId}`,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when replacing a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should update a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: `${moviesEndpoint}/${testMovieId}`,
      payload: {
        type: 'movie'
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when updating a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`,
      payload: {
        type: 'movie'
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should delete a movie', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${moviesEndpoint}/${testMovieId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when deleting a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should fetch movie comments', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}/${testMovieId}/comments?${pagination}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });
});
