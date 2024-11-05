import type { FastifyInstance, InjectOptions } from 'fastify';
import type { MovieCommentSchemaType } from '../../schemas/movies/data';
import { AppConfigDefaults, TestConstants } from '../../utils/constants/constants';
import {
  FetchTypes,
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes
} from '../../utils/constants/enums';
import {
  expectCachedResponse,
  expectHalResponse,
  expectNotCachedResponse,
  genRandomString,
  getValidToken,
  waitFor
} from '../../utils/test-utils';
import buildTestInstance from '../../utils/testing/test-server';

describe('moviesAPI', () => {
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

    [
      { method: HttpMethods.POST, url: moviesEndpoint },
      { method: HttpMethods.PUT, url: movieIdEndpoint },
      { method: HttpMethods.PATCH, url: movieIdEndpoint },
      { method: HttpMethods.DELETE, url: movieIdEndpoint }
    ].forEach((route) => {
      expect(fastifyInstance.hasRoute(route)).toBeTruthy();
    });
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

  it('should fetch movies with HAL', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}`,
      headers: { accept: HttpMediaTypes.HAL_JSON }
    });
    expectHalResponse(response, FetchTypes.Collection);
  });

  it('should fetch movies with caching', async () => {
    const options: InjectOptions = {
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}`,
      headers: { 'cache-control': 'max-age=3600' }
    };

    const firstResponse = await fastifyInstance.inject({
      ...options,
      headers: { ...options.headers, 'cache-control': 'no-cache' }
    });
    const secondResponse = await fastifyInstance.inject(options);

    expectNotCachedResponse(firstResponse);
    expectCachedResponse(secondResponse);
  });

  it('should respect the request cache-control max-age', async () => {
    const maxAge = 1;
    const options: InjectOptions = {
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}`,
      headers: { 'cache-control': `max-age=${maxAge}` }
    };

    expect(maxAge).toBeLessThan(AppConfigDefaults.cacheExpiration_s);

    await waitFor(maxAge + 1);
    const firstResponse = await fastifyInstance.inject(options);
    await waitFor(maxAge + 1);
    const secondResponse = await fastifyInstance.inject(options);

    expectNotCachedResponse(firstResponse);
    expectNotCachedResponse(secondResponse);
  });

  it('should fetch movies with HAL with caching', async () => {
    const options: InjectOptions = {
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}`,
      headers: { accept: HttpMediaTypes.HAL_JSON, 'cache-control': 'max-age=3600' }
    };

    const firstResponse = await fastifyInstance.inject({
      ...options,
      headers: { ...options.headers, 'cache-control': 'no-cache' }
    });
    const secondResponse = await fastifyInstance.inject(options);

    expectHalResponse(firstResponse, FetchTypes.Collection);
    expectHalResponse(secondResponse, FetchTypes.Collection);
    expectNotCachedResponse(firstResponse);
    expectCachedResponse(secondResponse);
  });

  it('should fetch movies and return a 304 if the request is fresh', async () => {
    const options: InjectOptions = {
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}`
    };

    const firstResponse = await fastifyInstance.inject(options);
    const eTag = firstResponse.headers.etag;
    const secondResponse = await fastifyInstance.inject({
      ...options,
      headers: { ...options.headers, 'if-none-match': eTag }
    });

    expect(firstResponse.statusCode).toBe(HttpStatusCodes.OK);
    expect(secondResponse.statusCode).toBe(HttpStatusCodes.NotModified);
  });

  it('should filter movies by title', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}&filter=title:alien`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should filter movies by year', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}&filter=year:1979`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should filter movies by several properties', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}?${pagination}&filter=title:alien,year:1979,lastupdated:2000-01-01`
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

  it('should not create a movie if unauthorized', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: moviesEndpoint,
      payload: { ...testMovie, year: 1899 }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Unauthorized);
  });

  it('should create a movie when authorized', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: moviesEndpoint,
      payload: { ...testMovie, year: 1899 },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Created);
  });

  it('should report a conflict when trying to create a movie replica', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: moviesEndpoint,
      payload: testMovie,
      headers: { authorization: `Bearer ${token}` }
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

  it('should fetch a movie by id with HAL', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}/${testMovieId}`,
      headers: { accept: HttpMediaTypes.HAL_JSON }
    });
    expectHalResponse(response, FetchTypes.Resource);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when fetching a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should not replace a movie if unauthorized', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${moviesEndpoint}/${testMovieId}`,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Unauthorized);
  });

  it('should replace a movie when authorized', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${moviesEndpoint}/${testMovieId}`,
      payload: testMovie,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when replacing a non-existent movie`, async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`,
      payload: testMovie,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should update a movie', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: `${moviesEndpoint}/${testMovieId}`,
      payload: {
        type: 'movie'
      },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when updating a non-existent movie`, async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`,
      payload: {
        type: 'movie'
      },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NotFound);
  });

  it('should not delete a movie if unauthorized', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${moviesEndpoint}/${testMovieId}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Unauthorized);
  });

  it('should delete a movie when authorized', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${moviesEndpoint}/${testMovieId}`,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
  });

  it(`should return a ${HttpStatusCodes.NotFound} when deleting a non-existent movie`, async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: `${moviesEndpoint}/${TestConstants.fakeId}`,
      headers: { authorization: `Bearer ${token}` }
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

  it('should fetch movie comments with HAL', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}/${testMovieId}/comments?${pagination}`,
      headers: { accept: HttpMediaTypes.HAL_JSON }
    });
    expectHalResponse(response, FetchTypes.Collection);
  });

  it('should create a movie comment', async () => {
    const token = getValidToken(fastifyInstance);
    const text = genRandomString();
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: `${moviesEndpoint}/${testMovieId}/comments`,
      payload: { text },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Created);

    const commentFetchResponse = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${moviesEndpoint}/${testMovieId}/comments`
    });

    expect(commentFetchResponse.statusCode).toBe(HttpStatusCodes.OK);
    const comments = JSON.parse(commentFetchResponse.body) as { data: MovieCommentSchemaType[] };
    expect(comments.data).toBeDefined();
    expect(comments.data).toBeInstanceOf(Array);
    expect(
      comments.data.some((comment: MovieCommentSchemaType) => comment.text === text)
    ).toBeTruthy();
  });

  it('should not create a movie comment if unauthorized', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: `${moviesEndpoint}/${testMovieId}/comments`,
      payload: {
        text: 'This is a test comment'
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Unauthorized);
  });
});
