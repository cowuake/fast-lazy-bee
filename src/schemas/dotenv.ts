import { type Static, Type } from '@sinclair/typebox';
import { AppConfigDefaults } from '../utils/constants';

export const EnvSchema = Type.Object({
  NODE_ENV: Type.String({ default: AppConfigDefaults.env }),
  APP_PORT: Type.Number({ default: AppConfigDefaults.port }),
  MONGO_URL: Type.String({ default: AppConfigDefaults.mongoUrl })
});

export type EnvSchemaType = Static<typeof EnvSchema>;
