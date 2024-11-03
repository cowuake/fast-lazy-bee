import type { FastifyInstance, FastifyRequest, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';
import * as CacheUtils from '../utils/cache-utils';
import { AppConfigDefaults } from '../utils/constants/constants';
import { RouteTags } from '../utils/constants/enums';
import { hashValue as getKeySignature } from '../utils/crypto-utils';

const isCacheable = (request: FastifyRequest): boolean => {
  const routeOptions = request.routeOptions as RouteOptions;
  if (routeOptions.schema?.tags == null) {
    return false;
  }
  return routeOptions.schema.tags.includes(RouteTags.Cache);
};

const specifiesNoCache = (request: FastifyRequest): boolean =>
  request.headers['cache-control']?.match(/no-cache/i) != null;

const getMaxAge = (request: FastifyRequest): number =>
  Number.parseInt(
    request.headers['cache-control']?.match(/max-age=(\d+)/i)?.[1] ??
      AppConfigDefaults.cacheExpiration_s.toString()
  );

const cachePlugin = fp(
  async (fastify: FastifyInstance) => {
    fastify.addHook('onRequest', async (request, reply) => {
      if (!isCacheable(request)) {
        fastify.log.info(`Route ${request.method}~${request.url} is not cacheable`);
        return;
      }

      if (specifiesNoCache(request)) {
        fastify.log.info('Cache bypassed due to no-cache directive');
        return;
      }

      const cacheKey = CacheUtils.genCacheKey(request);

      fastify.cache.get(cacheKey, (err, value) => {
        if (err != null) {
          fastify.log.error(err);
          return;
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
            return;
          }
          reply.headers({ ...headers, age: age.toString() }).send(JSON.parse(payload));
        } else {
          fastify.log.info(`Cache miss for key: ${cacheKeySignature}`);
          reply.header('last-modified', new Date().toUTCString());
        }
      });
    });

    fastify.addHook('onSend', async (request, reply, payload) => {
      const cacheKey = CacheUtils.genCacheKey(request);

      fastify.cache.get(cacheKey, (err, value) => {
        if (err != null) {
          fastify.log.error(err);
          return;
        }
        if (value != null) {
          fastify.log.info('Cache hit, not storing response');
          return;
        }

        const headers = { ...reply.getHeaders() };
        const cachedAt = Date.now();
        const cacheValue = { headers, payload, cachedAt };

        fastify.cache.set(
          cacheKey,
          cacheValue,
          AppConfigDefaults.cacheExpiration_s * 1000,
          (err) => {
            if (err != null) {
              fastify.log.error(err);
            }
          }
        );

        const cacheKeySignature = getKeySignature(cacheKey);
        fastify.log.info(`Cached response for key: ${cacheKeySignature}`);
      });
    });
  },
  { name: 'cache', dependencies: ['server-config'] }
);

export default cachePlugin;
