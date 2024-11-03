import { type Static, Type } from '@sinclair/typebox';
import { StringSchema } from '../data';

const JwtSchema = Type.Object({
  token: StringSchema
});

type JwtSchemaType = Static<typeof JwtSchema>;

export { JwtSchema, type JwtSchemaType };
