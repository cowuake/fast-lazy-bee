import type { FastifyInstance } from 'fastify';
import { TestConstants } from '../../utils/constants/constants';
import { HttpStatusCodes } from '../../utils/constants/enums';
import buildTestInstance from '../../utils/testing/build-test-instance';

describe(' diagnosticsApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();

  it('should rely on a defined Fastify instance', () => {
    expect(fastifyInstance).toBeDefined();
  });

  it('should return the API health status', async () => {
    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `${TestConstants.v1Root}/health`
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });
});
