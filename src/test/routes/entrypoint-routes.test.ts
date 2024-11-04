import type { FastifyInstance } from 'fastify';
import { TestConstants } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import TestServer from '../../utils/testing/build-test-instance';

describe('API entry point', () => {
  const fastifyInstance: FastifyInstance = TestServer.getInstance();
  const entryPoint = `${TestConstants.v1Root}/`;

  it('should rely on a defined Fastify instance', () => {
    expect(fastifyInstance).toBeDefined();
  });

  it('should return the available HTTP methods', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.OPTIONS,
      url: entryPoint
    });
    expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
    expect(response.headers).toHaveProperty('allow');
  });

  it('should return something', async () => {
    const response = await fastifyInstance.inject({
      method: 'GET',
      url: entryPoint
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
    expect(response.body).toBeDefined();
  });
});
