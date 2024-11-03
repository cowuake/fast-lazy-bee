import type { FastifySchema } from 'fastify';
import { HttpMediaTypes, HttpStatusCodes } from '../../utils/constants/enums';
import { createTextResponseSchema } from '../../utils/routing-utils';

const GetHealthSchema: FastifySchema = {
  produces: [HttpMediaTypes.TEXT_PLAIN],
  summary: 'Get the health status of the API',
  response: {
    ...createTextResponseSchema(HttpStatusCodes.OK)
  }
};

export { GetHealthSchema };
