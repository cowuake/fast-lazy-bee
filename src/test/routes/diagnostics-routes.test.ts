import type { FastifyInstance } from 'fastify';
import buildTestInstance from '../../utils/testing/build-test-instance';
import { HttpStatusCodes } from '../../utils/constants/enums';

describe(' diagnosticsApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();

  it('should be defined', () => {
    expect(fastifyInstance).toBeDefined();
  });

  test('should be defined', async () => {
    const response = await fastifyInstance.inject({
      method: 'GET',
      url: '/health'
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });
});
