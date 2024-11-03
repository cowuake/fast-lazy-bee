import type { FastifyCachingPluginOptions } from '@fastify/caching';
import fastifyCaching from '@fastify/caching';
import { AppConfigDefaults } from '../utils/constants/constants';

const cacheOptions: FastifyCachingPluginOptions = {
  privacy: fastifyCaching.privacy.PRIVATE,
  expiresIn: AppConfigDefaults.cacheExpiration_s
};

export { cacheOptions };
