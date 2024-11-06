import type { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';
import { CONFIG_DEFAULTS } from '../utils/constants/constants';
import { HttpMediaTypes, RouteTags } from '../utils/constants/enums';
import { hashValue as getKeySignature } from '../utils/crypto-utils';

const genCacheKey = (request: FastifyRequest): string => {
  const accept = request.headers.accept ?? HttpMediaTypes.JSON;
  const { method, url, params } = request;
  const keySource = { method, url, params, accept };
  return JSON.stringify(keySource);
};

const getExpirationDate = (): Date => {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + CONFIG_DEFAULTS.CACHE_EXPIRATION_S);

  return expirationDate;
};

const isCacheable = (request: FastifyRequest, reply: FastifyReply | null = null): boolean => {
  const routeOptions = request.routeOptions as RouteOptions;
  if (routeOptions.schema?.tags == null) {
    return false;
  }

  const isRouteCacheable = routeOptions.schema.tags.includes(RouteTags.CACHE);
  const isSuccess = reply == null || reply.statusCode < 300;

  return isRouteCacheable && isSuccess;
};

const doesNotAllowCache = (request: FastifyRequest): boolean =>
  request.headers['cache-control']?.match(/no-cache/i) != null;

const getMaxAge = (request: FastifyRequest): number =>
  Number.parseInt(
    request.headers['cache-control']?.match(/max-age=(\d+)/i)?.[1] ??
      CONFIG_DEFAULTS.CACHE_EXPIRATION_S.toString()
  );

const putInCache = (
  fastify: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown
): boolean => {
  if (!isCacheable(request, reply) || doesNotAllowCache(request)) {
    fastify.log.info(
      `Caching bypassed based on ${reply.statusCode}@${request.method}@${request.url}`
    );
    return false;
  }

  const cacheKey = genCacheKey(request);

  fastify.cache.get(cacheKey, (err, value) => {
    if (err != null) {
      fastify.log.error(err);
      return false;
    }
    if (value != null) {
      fastify.log.info('Cache hit, not storing response');
      return false;
    }

    const headers = { ...reply.getHeaders() };
    const cachedAt = Date.now();
    const cacheValue = { headers, payload, cachedAt };

    fastify.cache.set(cacheKey, cacheValue, CONFIG_DEFAULTS.CACHE_EXPIRATION_S * 1000, (err) => {
      if (err != null) {
        fastify.log.error(err);
      }
    });

    const cacheKeySignature = getKeySignature(cacheKey);
    fastify.log.info(`Cached response for key: ${cacheKeySignature}`);
  });

  return true;
};

const getFromCache = (
  fastify: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
): boolean => {
  if (!isCacheable(request)) {
    fastify.log.info(`Route ${request.method}@${request.url} is not cacheable`);
    return false;
  }

  if (doesNotAllowCache(request)) {
    fastify.log.info('Cache bypassed due to no-cache directive');
    return false;
  }

  const cacheKey = genCacheKey(request);

  fastify.cache.get(cacheKey, (err, value) => {
    if (err != null) {
      fastify.log.error(err);

      return false;
    }

    const cacheKeySignature = getKeySignature(cacheKey);

    if (value != null) {
      fastify.log.info(`Cache hit for key: ${cacheKeySignature}`);

      const { payload, headers, cachedAt } = value.item as {
        payload: string;
        headers: Record<string, string>;
        cachedAt: number;
      };

      const age = Math.ceil((Date.now() - cachedAt) / 1000);
      const maxAge = getMaxAge(request);

      if (age > maxAge) {
        fastify.log.info(`Cache stale for key: ${cacheKeySignature}`);

        return false;
      }

      reply.headers({ ...headers, age: age.toString() }).send(JSON.parse(payload));
    } else {
      fastify.log.info(`Cache miss for key: ${cacheKeySignature}`);
      reply.header('last-modified', new Date().toUTCString());

      return false;
    }
  });

  return true;
};

const cachePlugin = fp(
  async (fastify: FastifyInstance) => {
    fastify.addHook('onRequest', async (request, reply) => {
      getFromCache(fastify, request, reply);
    });

    fastify.addHook('onSend', async (request, reply, payload) => {
      putInCache(fastify, request, reply, payload);
    });
  },
  { name: 'cache', dependencies: ['server-config'] }
);

export default cachePlugin;
export { doesNotAllowCache, getExpirationDate, getFromCache, getMaxAge, isCacheable, putInCache };
