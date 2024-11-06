import type { FastifyCachingPluginOptions } from '@fastify/caching';
import fastifyCaching from '@fastify/caching';
import { CONFIG_DEFAULTS } from '../utils/constants/constants';

const cacheOptions: FastifyCachingPluginOptions = {
  privacy: fastifyCaching.privacy.PRIVATE,
  expiresIn: CONFIG_DEFAULTS.CACHE_EXPIRATION_S
};

export { cacheOptions };
