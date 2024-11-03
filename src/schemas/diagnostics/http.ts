import type { FastifySchema } from 'fastify';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { createTextResponseSchema } from '../../utils/routing-utils';

const GetHealthSchema: FastifySchema = {
  summary: 'Get the health status of the API',
  response: {
    ...createTextResponseSchema(HttpStatusCodes.OK)
  }
};

export { GetHealthSchema };
