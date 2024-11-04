import type { FastifyInstance } from 'fastify';
import { TestConstants } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import { genRandomEmail } from '../../utils/test-utils';
import TestServer from '../../utils/testing/test-server';

describe('usersAPI', () => {
  const fastifyInstance: FastifyInstance = TestServer.getInstance();
  const usersEndpoint = `${TestConstants.v1Root}/users`;
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
      expect(response.statusCode).toBe(HttpStatusCodes.NoContent);
      expect(response.headers).toHaveProperty('allow');
    }
  });

  it('should return a 201 status code when registering a new user', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.POST,
      url: usersEndpoint,
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
      url: usersEndpoint,
      payload: {
        name: TestConstants.userName,
        email: TestConstants.userEmail,
        password: TestConstants.userPassword
      }
    });
    expect(response.statusCode).toBe(HttpStatusCodes.Conflict);
  });
});
