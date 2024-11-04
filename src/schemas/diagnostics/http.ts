import type { FastifySchema } from 'fastify';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { createJsonResponseSchema } from '../../utils/routing-utils';
import { HealthReportSchema } from './data';

const GetHealthSchema: FastifySchema = {
  summary: 'Get the health status report for the API',
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, HealthReportSchema, false)
  }
};

export { GetHealthSchema };
