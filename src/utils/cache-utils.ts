import type { FastifyRequest } from 'fastify';

function genCacheKey(request: FastifyRequest): string {
  const { method, url, params, body } = request;
  return JSON.stringify({ method, url, params, body });
}

export { genCacheKey };
