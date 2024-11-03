import { Type } from '@sinclair/typebox';

const DateSchema = Type.String({
  format: 'date-time',
  description: 'A valid date',
  examples: ['2021-01-01T00:00:00Z']
});
const EmailSchema = Type.String({
  format: 'email',
  description: 'A valid email address',
  examples: ['honking.duck@quackworld.com']
});
const FloatSchema = Type.Number({ format: 'float', examples: [3.14] });
const NaturalNumberSchema = Type.Integer({
  minimum: 0,
  description: 'A natural number',
  examples: [42]
});
const StringSchema = Type.String({
  minLength: 1,
  description: 'A string',
  examples: ['The most beautiful words you can imagine :)']
});
const EmptyStringSchema = Type.String({
  minLength: 0,
  maxLength: 0,
  description: 'Empty',
  default: '',
  examples: ['']
});
const UriSchema = Type.String({
  format: 'uri',
  description: 'A valid URI',
  examples: ['http://example.com']
});

const StringArraySchema = Type.Array(StringSchema, {
  minItems: 1,
  uniqueItems: true,
  description: 'An array of strings',
  examples: [['foo', 'bar']]
});

export {
  DateSchema,
  EmailSchema,
  EmptyStringSchema,
  FloatSchema,
  NaturalNumberSchema,
  StringArraySchema,
  StringSchema,
  UriSchema
};
