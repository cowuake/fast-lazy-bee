import type { FastifyInstance, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';
import * as CacheUtils from '../utils/cache-utils';

module.exports = fp(async (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const routeOptions = request.routeOptions as RouteOptions;
    if (!routeOptions.schema?.tags?.includes('Cache')) {
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
    const routeOptions = request.routeOptions as RouteOptions;
    if (!routeOptions.schema?.tags?.includes('Cache') || reply.statusCode !== 200) {
      return;
    }

    const cacheKey = CacheUtils.genCacheKey(request);
    fastify.cache.get(cacheKey, (err, value) => {
      if (err != null) {
        fastify.log.error(err);
        return;
      }
      if (value == null) {
        fastify.cache.set(cacheKey, payload, 10000, (err) => {
          if (err != null) {
            fastify.log.error(err);
          }
        });
      }
    });
  });
});
