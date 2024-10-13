import { FastifyRequest } from 'fastify';

export function genCacheKey(request: FastifyRequest) {
  const { method, url, params, body } = request;
  return JSON.stringify({ method, url, params, body });
}
