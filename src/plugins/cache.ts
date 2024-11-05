import type { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';
import * as CacheUtils from '../utils/cache-utils';
import { AppConfigDefaults } from '../utils/constants/constants';
import { RouteTags } from '../utils/constants/enums';
import { hashValue as getKeySignature } from '../utils/crypto-utils';

const isCacheable = (request: FastifyRequest, reply: FastifyReply | null = null): boolean => {
  const routeOptions = request.routeOptions as RouteOptions;
  if (routeOptions.schema?.tags == null) {
    return false;
  }

  const isRouteCacheable = routeOptions.schema.tags.includes(RouteTags.Cache);
  const isSuccess = reply == null || reply.statusCode < 300;

  return isRouteCacheable && isSuccess;
};

const doesNotAllowCache = (request: FastifyRequest): boolean =>
  request.headers['cache-control']?.match(/no-cache/i) != null;

const getMaxAge = (request: FastifyRequest): number =>
  Number.parseInt(
    request.headers['cache-control']?.match(/max-age=(\d+)/i)?.[1] ??
      AppConfigDefaults.cacheExpiration_s.toString()
  );

const putInCache = async (
  fastify: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown
): Promise<boolean> => {
  if (!isCacheable(request, reply) || doesNotAllowCache(request)) {
    fastify.log.info(
      `Caching bypassed based on ${reply.statusCode}@${request.method}@${request.url}`
    );
    return false;
  }

  const cacheKey = CacheUtils.genCacheKey(request);

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

    fastify.cache.set(cacheKey, cacheValue, AppConfigDefaults.cacheExpiration_s * 1000, (err) => {
      if (err != null) {
        fastify.log.error(err);
      }
    });

    const cacheKeySignature = getKeySignature(cacheKey);
    fastify.log.info(`Cached response for key: ${cacheKeySignature}`);
  });

  return true;
};

const getFromCache = async (
  fastify: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<boolean> => {
  if (!isCacheable(request)) {
    fastify.log.info(`Route ${request.method}@${request.url} is not cacheable`);
    return false;
  }

  if (doesNotAllowCache(request)) {
    fastify.log.info('Cache bypassed due to no-cache directive');
    return false;
  }

  const cacheKey = CacheUtils.genCacheKey(request);

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
      await getFromCache(fastify, request, reply);
    });

    fastify.addHook('onSend', async (request, reply, payload) => {
      await putInCache(fastify, request, reply, payload);
    });
  },
  { name: 'cache', dependencies: ['server-config'] }
);

export default cachePlugin;
export { doesNotAllowCache, getFromCache, getMaxAge, isCacheable, putInCache };
