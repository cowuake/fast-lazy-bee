import type { FastifyInstance } from 'fastify';
import { API_ENDPOINTS, API_V1_PREFIX } from '../../utils/constants/constants';
import { HttpMediaTypes, HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import buildTestInstance from '../../utils/testing/test-server';

describe('diagnosticsApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const healthEndpoint = API_V1_PREFIX + API_ENDPOINTS.HEALTH;
  const allUrls = [healthEndpoint];

  it('should rely on a defined Fastify instance', () => {
    expect(fastifyInstance).toBeDefined();
  });

  it('should return the available HTTP methods', async () => {
    for (const url of allUrls) {
      const response = await fastifyInstance.inject({
        method: HttpMethods.OPTIONS,
        url
      });
      expect(response.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
      expect(response.headers).toHaveProperty('allow');
    }
  });

  it('should return the API health status', async () => {
    const response = await fastifyInstance.inject({
      method: 'GET',
      url: healthEndpoint
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should return the API health status in HAL format', async () => {
    const response = await fastifyInstance.inject({
      method: 'GET',
      url: healthEndpoint,
      headers: { Accept: HttpMediaTypes.HAL_JSON }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
    expect(response.headers['content-type']).toBe('application/hal+json; charset=utf-8');
  });
});
