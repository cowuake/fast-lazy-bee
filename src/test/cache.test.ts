import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getFromCache, putInCache } from '../plugins/cache';
import { HttpMethods, HttpStatusCodes, RouteTags } from '../utils/constants/enums';

const genMockRequest = (method: string, isCacheableRoute: boolean): FastifyRequest =>
  ({
    method,
    url: '',
    headers: {},
    routeOptions: {
      schema: {
        tags: isCacheableRoute ? [RouteTags.Cache] : []
      }
    }
  }) as unknown as FastifyRequest;

const genMockReply = (statusCode: number): FastifyReply =>
  ({
    statusCode,
    send: jest.fn(),
    getHeaders: jest.fn()
  }) as unknown as FastifyReply;

describe('Cache plugin', () => {
  const fastifyInstance: FastifyInstance = {
    cache: {
      set: jest.fn(),
      get: jest.fn()
    },
    log: {
      info: jest.fn(),
      error: jest.fn()
    }
  } as unknown as FastifyInstance;

  it('should not cache an error response', async () => {
    const request = genMockRequest(HttpMethods.GET, true);

    for (const status of Object.values(HttpStatusCodes).filter(
      (value) => (value.valueOf() as number) >= 400
    )) {
      const reply = genMockReply(status as unknown as number);
      const hasBeenCached = await putInCache(fastifyInstance, request, reply, {});

      expect(hasBeenCached).toBeFalsy();
    }
  });

  it('should not cache a non-cacheable route', async () => {
    const request = genMockRequest(HttpMethods.GET, false);
    const reply = genMockReply(HttpStatusCodes.OK);
    const hasBeenCached = await putInCache(fastifyInstance, request, reply, {});

    expect(hasBeenCached).toBeFalsy();
  });

  it('should cache a successful response for a cacheable route', async () => {
    const request = genMockRequest(HttpMethods.GET, true);
    const reply = genMockReply(HttpStatusCodes.OK);
    const hasBeenCached = await putInCache(fastifyInstance, request, reply, {});

    expect(hasBeenCached).toBeTruthy();
  });

  it('should not cache a response if the request does not allow caching', async () => {
    const request = genMockRequest(HttpMethods.GET, true);
    request.headers['cache-control'] = 'no-cache';
    const reply = genMockReply(HttpStatusCodes.OK);
    const hasBeenCached = await putInCache(fastifyInstance, request, reply, {});

    expect(hasBeenCached).toBeFalsy();
  });

  it('should retrieve a response from the cache', async () => {
    const request = genMockRequest(HttpMethods.GET, true);
    const reply = genMockReply(HttpStatusCodes.OK);
    const hasGotFromCache = await getFromCache(fastifyInstance, request, reply);

    expect(hasGotFromCache).toBeTruthy();
  });

  it('should not retrieve a response from the cache for a non-cacheable route', async () => {
    const request = genMockRequest(HttpMethods.GET, false);
    const reply = genMockReply(HttpStatusCodes.OK);
    const hasGotFromCache = await getFromCache(fastifyInstance, request, reply);

    expect(hasGotFromCache).toBeFalsy();
  });

  it('should not retrieve a response from the cache if the request does not allow caching', async () => {
    const request = genMockRequest(HttpMethods.GET, true);
    request.headers['cache-control'] = 'no-cache';
    const reply = genMockReply(HttpStatusCodes.OK);
    const hasGotFromCache = await getFromCache(fastifyInstance, request, reply);

    expect(hasGotFromCache).toBeFalsy();
  });
});
