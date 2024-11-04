import { type Static, Type } from '@sinclair/typebox';
import { StringSchema } from '../data';
import { IdSchema } from '../movies/data';

const HealthReportSchema = Type.Object({
  _id: { ...IdSchema, default: '0' },
  status: { ...StringSchema, description: 'The current statuts of the API' }
});

type HealthReportSchemaType = Static<typeof HealthReportSchema>;

export { HealthReportSchema, type HealthReportSchemaType };
