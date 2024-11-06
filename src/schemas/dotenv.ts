import { type Static, Type } from '@sinclair/typebox';
import { CONFIG_DEFAULTS } from '../utils/constants/constants';

const EnvSchema = Type.Object({
  NODE_ENV: Type.String({ default: CONFIG_DEFAULTS.ENV }),
  APP_PORT: Type.Number({ default: CONFIG_DEFAULTS.PORT }),
  MONGO_IMAGE: Type.String({ default: CONFIG_DEFAULTS.MONGO_IMAGE }),
  MONGO_URL: Type.String({ default: CONFIG_DEFAULTS.MONGO_URL }),
  MONGO_DB_NAME: Type.String({ default: CONFIG_DEFAULTS.MONGO_DB_NAME })
});

type EnvSchemaType = Static<typeof EnvSchema>;

export { EnvSchema, type EnvSchemaType };
