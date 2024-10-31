import type { FastifyRequest } from 'fastify';

function genCacheKey(request: FastifyRequest): string {
  const { method, url, headers, params, body } = request;
  return JSON.stringify({ method, url, headers, params, body });
}

export { genCacheKey };
