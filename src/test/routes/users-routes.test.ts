import type { FastifyInstance } from 'fastify';
import { API_ENDPOINTS, API_V1_PREFIX, TEST } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import { genRandomEmail } from '../../utils/test-utils';
import buildTestInstance from '../../utils/testing/test-server';

describe('usersAPI', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const usersEndpoint = API_V1_PREFIX + API_ENDPOINTS.USERS;
  const allUrls = [usersEndpoint];

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

  it('should return a 201 status code when registering a new user', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: usersEndpoint,
      payload: {
        name: TEST.USER_NAME,
        email: genRandomEmail(),
        password: TEST.USER_PASSWORD
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.CREATED);
  });

  it('should return a 409 status code when registering an existing user', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: usersEndpoint,
      payload: {
        name: TEST.USER_NAME,
        email: TEST.USER_EMAIL,
        password: TEST.USER_PASSWORD
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.CONFLICT);
  });
});
