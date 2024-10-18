import { Type } from '@sinclair/typebox';

const StringSchema = Type.String({ minLength: 1 });
const StringArraySchema = Type.Array(StringSchema, { minItems: 1 });
const FloatSchema = Type.Number({ format: 'float' });
const NaturalSchema = Type.Integer({ minimum: 0 });
const UriSchema = Type.String({ format: 'uri' });

export { StringSchema, StringArraySchema, FloatSchema, NaturalSchema, UriSchema };
