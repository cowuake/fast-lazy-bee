import type { FastifyServerOptions } from 'fastify';

const serverOptions: FastifyServerOptions = {
  caseSensitive: false,
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty'
    }
  }
};

export { serverOptions };
