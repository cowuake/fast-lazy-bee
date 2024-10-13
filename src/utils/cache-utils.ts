import type { FastifyRequest } from 'fastify';

export function genCacheKey(request: FastifyRequest): string {
  const { method, url, params, body } = request;
  return JSON.stringify({ method, url, params, body });
}
