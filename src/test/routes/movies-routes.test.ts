import type { FastifyInstance, InjectOptions } from 'fastify';
import type { MovieCommentSchemaType } from '../../schemas/movies/data';
import {
  API_ENDPOINTS,
  API_V1_PREFIX,
  CONFIG_DEFAULTS,
  MOVIE_COMMENTS_ENDPOINT,
  MOVIE_ENDPOINT,
  TEST
} from '../../utils/constants/constants';
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
  const moviesEndpoint = API_V1_PREFIX + API_ENDPOINTS.MOVIES;
  const plainMovieIdEndpoint = API_V1_PREFIX + API_ENDPOINTS.MOVIE;
  const plainCommentsEndpoint = API_V1_PREFIX + API_ENDPOINTS.MOVIE_COMMENTS;
  const pagination = 'page=1&size=10';

  const testMovie = TEST.TEST_MOVIE;
  const testMovieId = TEST.MAGIC_MOVIE_ID;
  const fakeMovieId = TEST.FAKE_MOVIE_ID;

  const testMovieIdEndpoint = API_V1_PREFIX + MOVIE_ENDPOINT(testMovieId);
  const testCommentsEndpoint = API_V1_PREFIX + MOVIE_COMMENTS_ENDPOINT(testMovieId);
  const fakeMovieIdEndpoint = API_V1_PREFIX + MOVIE_ENDPOINT(fakeMovieId);
  const fakeCommentsEndpoint = API_V1_PREFIX + MOVIE_COMMENTS_ENDPOINT(fakeMovieId);

  const allMovieUrls = [moviesEndpoint, plainMovieIdEndpoint];
  const allCommentsUrls = [plainCommentsEndpoint];
  const allUrls = [...allMovieUrls, ...allCommentsUrls];

  it('should rely on a defined Fastify instance', () => {
    expect(fastifyInstance).toBeDefined();
  });

  it('should include all expected movie endpoints', () => {
    allMovieUrls.forEach((url) => {
      expect(fastifyInstance.hasRoute({ method: HttpMethods.GET, url })).toBeTruthy();
      expect(fastifyInstance.hasRoute({ method: HttpMethods.OPTIONS, url })).toBeTruthy();
    });

    [
      { method: HttpMethods.POST, url: moviesEndpoint },
      { method: HttpMethods.PUT, url: plainMovieIdEndpoint },
      { method: HttpMethods.PATCH, url: plainMovieIdEndpoint },
      { method: HttpMethods.DELETE, url: plainMovieIdEndpoint }
    ].forEach((route) => {
      expect(fastifyInstance.hasRoute(route)).toBeTruthy();
    });
  });

  it('should include all expected comment endpoints', () => {
    expect(
      fastifyInstance.hasRoute({ method: HttpMethods.GET, url: plainCommentsEndpoint })
    ).toBeTruthy();
    expect(
      fastifyInstance.hasRoute({ method: HttpMethods.POST, url: plainCommentsEndpoint })
    ).toBeTruthy();
  });

  it('should return the available HTTP methods', async () => {
    for (const url of allUrls) {
      const response = await fastifyInstance.inject({
        method: HttpMethods.OPTIONS,
        url
      });
      expect(response.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
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
    expectHalResponse(response, FetchTypes.COLLECTION);
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

    expect(maxAge).toBeLessThan(CONFIG_DEFAULTS.CACHE_EXPIRATION_S);

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

    expectHalResponse(firstResponse, FetchTypes.COLLECTION);
    expectHalResponse(secondResponse, FetchTypes.COLLECTION);
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
    expect(secondResponse.statusCode).toBe(HttpStatusCodes.NOT_MODIFIED);
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
    expect(response.statusCode).toBe(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should create a movie when authorized', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: moviesEndpoint,
      payload: { ...testMovie, year: 1899 },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.CREATED);
  });

  it('should report a conflict when trying to create a movie replica', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: moviesEndpoint,
      payload: testMovie,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.CONFLICT);
  });

  it('should fetch a movie by id', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: testMovieIdEndpoint
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should fetch a movie by id with HAL', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: testMovieIdEndpoint,
      headers: { accept: HttpMediaTypes.HAL_JSON }
    });
    expectHalResponse(response, FetchTypes.RESOURCE);
  });

  it(`should return a ${HttpStatusCodes.NOT_FOUND} when fetching a non-existent movie`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: fakeMovieIdEndpoint
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NOT_FOUND);
  });

  it('should not replace a movie if unauthorized', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: testMovieIdEndpoint,
      payload: testMovie
    });
    expect(response.statusCode).toBe(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should replace a movie when authorized', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: testMovieIdEndpoint,
      payload: testMovie,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
  });

  it(`should return a ${HttpStatusCodes.NOT_FOUND} when replacing a non-existent movie`, async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PUT,
      url: fakeMovieIdEndpoint,
      payload: testMovie,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NOT_FOUND);
  });

  it('should update a movie', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: testMovieIdEndpoint,
      payload: {
        type: 'movie'
      },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
  });

  it(`should return a ${HttpStatusCodes.NOT_FOUND} when updating a non-existent movie`, async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.PATCH,
      url: fakeMovieIdEndpoint,
      payload: {
        type: 'movie'
      },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NOT_FOUND);
  });

  it('should not delete a movie if unauthorized', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: testMovieIdEndpoint
    });
    expect(response.statusCode).toBe(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should delete a movie when authorized', async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: testMovieIdEndpoint,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
  });

  it(`should return a ${HttpStatusCodes.NOT_FOUND} when deleting a non-existent movie`, async () => {
    const token = getValidToken(fastifyInstance);
    const response = await fastifyInstance.inject({
      method: HttpMethods.DELETE,
      url: fakeMovieIdEndpoint,
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NOT_FOUND);
  });

  it('should fetch movie comments', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${testCommentsEndpoint}?${pagination}`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it(`should return a ${HttpStatusCodes.NOT_FOUND} when fetching a non-existent movie's comments`, async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: fakeCommentsEndpoint
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NOT_FOUND);
  });

  it('should fetch movie comments with HAL', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: `${testCommentsEndpoint}?${pagination}`,
      headers: { accept: HttpMediaTypes.HAL_JSON }
    });
    expectHalResponse(response, FetchTypes.COLLECTION);
  });

  it('should create a movie comment', async () => {
    const token = getValidToken(fastifyInstance);
    const text = genRandomString();
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: testCommentsEndpoint,
      payload: { text },
      headers: { authorization: `Bearer ${token}` }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.CREATED);

    const commentFetchResponse = await fastifyInstance.inject({
      method: HttpMethods.GET,
      url: testCommentsEndpoint
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
      url: testCommentsEndpoint,
      payload: {
        text: 'This is a test comment'
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.UNAUTHORIZED);
  });
});
