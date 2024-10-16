import type { FastifyInstance } from 'fastify';
import { buildTestInstance } from '../utils/test-utils';
import { HttpStatusCodes } from '../utils/enums';

describe(' diagnosticsApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();

  it('should be defined', () => {
    expect(fastifyInstance).toBeDefined();
  });

  test('should be defined', () => {
    fastifyInstance
      .inject({
        method: 'GET',
        url: '/health'
      })
      .then((response) => {
        expect(response.statusCode).toBe(HttpStatusCodes.OK);
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
