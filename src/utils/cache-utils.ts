import type { FastifyRequest, RouteOptions } from 'fastify';
import { AppConfigDefaults, RouteTags } from './constants/constants';
import { HttpMediaTypes } from './constants/enums';

const genCacheKey = (request: FastifyRequest): string => {
  const accept = request.headers.accept ?? HttpMediaTypes.JSON;
  const { method, url, params } = request;
  const keySource = { method, url, params, accept };
  return JSON.stringify(keySource);
};

const getExpirationDate = (): Date => {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + AppConfigDefaults.cacheExpiration_s);
  return expirationDate;
};

const isCacheable = (request: FastifyRequest): boolean => {
  const routeOptions = request.routeOptions as RouteOptions;
  if (routeOptions.schema?.tags == null) {
    return false;
  }
  return routeOptions.schema.tags.includes(RouteTags.cache);
};

export { genCacheKey, getExpirationDate, isCacheable };
