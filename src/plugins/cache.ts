import type { FastifyInstance, FastifyRequest, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';
import * as CacheUtils from '../utils/cache-utils';
import { RouteTags } from '../utils/constants';
import { HttpStatusCodes } from '../utils/enums';

const isCacheable = (request: FastifyRequest): boolean => {
  const routeOptions = request.routeOptions as RouteOptions;
  if (routeOptions.schema?.tags == null) {
    return false;
  }
  return routeOptions.schema.tags.includes(RouteTags.cache);
};

const modulePlugin = fp(async (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', async (request, reply) => {
    if (!isCacheable(request)) {
      return;
    }

    const cacheKey = CacheUtils.genCacheKey(request);
    fastify.cache.get(cacheKey, (err, value) => {
      if (err != null) {
        fastify.log.error(err);
        return;
      }
      if (value != null) {
        fastify.log.info(`Cache hit for key: ${cacheKey}`);
        const payload = JSON.parse(value.item as string);
        reply.send(payload);
      }
    });
  });

  fastify.addHook('onSend', async (request, reply, payload) => {
    if (!isCacheable(request) || reply.statusCode !== HttpStatusCodes.OK) {
      return;
    }

    const cacheKey = CacheUtils.genCacheKey(request);
    fastify.cache.get(cacheKey, (err, value) => {
      if (err != null) {
        fastify.log.error(err);
        return;
      }
      if (value == null) {
        fastify.cache.set(cacheKey, payload, fastify.config.CACHE_EXPIRATION, (err) => {
          if (err != null) {
            fastify.log.error(err);
          }
        });
      }
    });
  });
});

export default modulePlugin;
