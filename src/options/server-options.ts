import type { FastifyServerOptions } from 'fastify';

export const serverOptions: FastifyServerOptions = {
  caseSensitive: false,
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty'
    }
  }
};
