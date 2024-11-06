import type { FastifyInstance } from 'fastify';
import { API_ENDPOINTS, API_V1_PREFIX } from '../../utils/constants/constants';
import {
  FetchTypes,
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes
} from '../../utils/constants/enums';
import { expectHalResponse } from '../../utils/test-utils';
import buildTestInstance from '../../utils/testing/test-server';

describe('API entry point', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();
  const entryPoint = API_V1_PREFIX + API_ENDPOINTS.ENTRY_POINT;

  it('should rely on a defined Fastify instance', () => {
    expect(fastifyInstance).toBeDefined();
  });

  it('should return the available HTTP methods', async () => {
    const response = await fastifyInstance.inject({
      method: HttpMethods.OPTIONS,
      url: entryPoint
    });

    expect(response.statusCode).toBe(HttpStatusCodes.NO_CONTENT);
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

  it('should return a HAL document', async () => {
    const response = await fastifyInstance.inject({
      method: 'GET',
      url: entryPoint,
      headers: { Accept: HttpMediaTypes.HAL_JSON }
    });

    expect(response.statusCode).toBe(HttpStatusCodes.OK);
    expectHalResponse(response, FetchTypes.RESOURCE);
  });
});
