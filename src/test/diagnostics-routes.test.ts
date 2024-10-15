import type { FastifyInstance } from 'fastify';
import { buildTestInstance } from '../utils/test-utils';

describe(' diagnosticsApi', () => {
  const fastifyInstance: FastifyInstance = buildTestInstance();

  it('should be defined', () => {
    expect(fastifyInstance).toBeDefined();
  });

  test('should be defined', () => {
    fastifyInstance.inject(
      {
        method: 'GET',
        url: '/health'
      },
      (err, response) => {
        expect(err).toBeNull();
        expect(response).toBeDefined();
        expect(response?.statusCode).toBe(200);
      }
    );
  });
});
