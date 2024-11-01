import { type Static, Type } from '@sinclair/typebox';
import { AppConfigDefaults } from '../utils/constants/constants';

const EnvSchema = Type.Object({
  NODE_ENV: Type.String({ default: AppConfigDefaults.env }),
  APP_PORT: Type.Number({ default: AppConfigDefaults.port }),
  MONGO_IMAGE: Type.String({ default: AppConfigDefaults.mongoImage }),
  MONGO_URL: Type.String({ default: AppConfigDefaults.mongoUrl }),
  MONGO_DB_NAME: Type.String({ default: AppConfigDefaults.mongoDbName }),
  CACHE_EXPIRATION_S: Type.Number({ default: AppConfigDefaults.cacheExpiration_s })
});

type EnvSchemaType = Static<typeof EnvSchema>;

export { EnvSchema, type EnvSchemaType };
