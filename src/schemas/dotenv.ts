import { type Static, Type } from '@sinclair/typebox';

export const EnvSchema = Type.Object({
  NODE_ENV: Type.String({ default: 'development' }),
  APP_PORT: Type.Number({ default: 3000 }),
  MONGO_URL: Type.String({ default: 'mongodb://localhost:27027/sample_mflix' })
});

export type EnvSchemaType = Static<typeof EnvSchema>;
