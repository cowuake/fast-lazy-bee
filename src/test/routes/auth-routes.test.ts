import type { FastifyInstance } from 'fastify';
import { TestConstants } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import { genRandomEmail } from '../../utils/test-utils';
import buildTestInstance from '../../utils/testing/build-test-instance';

describe('authAPI', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const authEndpoint = `${TestConstants.v1Root}/auth`;
  const loginEndpoint = `${authEndpoint}/login`;
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
      expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
      expect(response.headers).toHaveProperty('allow');
    }
  });

  it('should return a 401 status code when cannot authenticate a user at login', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: `${authEndpoint}/login`,
      payload: {
        email: TestConstants.impossibleEmail,
        password: TestConstants.impossiblePassword
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Unauthorized);
  });

  it('should return a valid JWT token to an authenticated user at login', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: `${authEndpoint}/login`,
      payload: {
        name: TestConstants.userName,
        email: TestConstants.userEmail,
        password: TestConstants.userPassword
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.OK);
  });

  it('should return a 201 status code when registering a new user', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: `${authEndpoint}/register`,
      payload: {
        name: TestConstants.userName,
        email: genRandomEmail(),
        password: TestConstants.userPassword
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Created);
  });

  it('should return a 409 status code when registering an existing user', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: `${authEndpoint}/register`,
      payload: {
        name: TestConstants.userName,
        email: TestConstants.userEmail,
        password: TestConstants.userPassword
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Conflict);
  });
});
