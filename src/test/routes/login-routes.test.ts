import type { FastifyInstance } from 'fastify';
import { API_ENDPOINTS, API_V1_PREFIX, TEST } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import buildTestInstance from '../../utils/testing/test-server';

describe('authAPI', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const loginEndpoint = API_V1_PREFIX + API_ENDPOINTS.LOGIN;
  const allUrls = [loginEndpoint];

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

  it('should return a 401 status code when cannot authenticate a user at login', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: loginEndpoint,
      payload: {
        email: TEST.IMPOSSIBLE_EMAIL,
        password: TEST.IMPOSSIBLE_PASSWORD
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.UNAUTHORIZED);
  });

  it('should return a valid JWT token to an authenticated user at login', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: loginEndpoint,
      payload: {
        name: TEST.USER_NAME,
        email: TEST.USER_EMAIL,
        password: TEST.USER_PASSWORD
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });
});
