import type { FastifyInstance } from 'fastify';
import { TestConstants } from '../../utils/constants/constants';
import { HttpMediaTypes, HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import buildTestInstance from '../../utils/testing/build-test-instance';

describe('diagnosticsApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const healthEndpoint = `${TestConstants.v1Root}/health`;
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
      expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
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
