import { type Static, Type } from '@sinclair/typebox';
import { AppConfigDefaults } from '../utils/constants';

const EnvSchema = Type.Object({
  NODE_ENV: Type.String({ default: AppConfigDefaults.env }),
  APP_PORT: Type.Number({ default: AppConfigDefaults.port }),
  MONGO_URL: Type.String({ default: AppConfigDefaults.mongoUrl }),
  CACHE_EXPIRATION: Type.Number({ default: AppConfigDefaults.cacheExpiration })
});

type EnvSchemaType = Static<typeof EnvSchema>;

export { EnvSchema, type EnvSchemaType };
