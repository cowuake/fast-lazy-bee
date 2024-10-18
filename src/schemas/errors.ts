import { type Static, Type } from '@sinclair/typebox';

const ErrorsDetailSchema = Type.String({
  description:
    'A granular descrtion on the specific error related to a body property, query parameter, path parameter, and/or header',
  maxLength: 4096
});

const ErrorsPointerSchema = Type.String({
  description: 'A JSON Pointer [RFC 6901] to the associated entity in the request document',
  maxLength: 1024
});

const ErrorsParameterSchema = Type.String({
  description: 'The parameter that caused the error',
  maxLength: 1024
});

const ErrorsHeaderSchema = Type.String({
  description: 'The header that caused the error',
  maxLength: 1024
});

const ErrorsCodeSchema = Type.String({
  description: 'Additional application-specific error code',
  maxLength: 50
});

const ErrorTypeSchema = Type.String({
  description: 'A URI reference [RFC 9457] that identifies the problem type',
  format: 'uri',
  maxLength: 1024
});

const ErrorStatusSchema = Type.Integer({
  description:
    'The HTTP status code generated by the origin server for this occurrence of the problem',
  format: 'int32',
  minimum: 100,
  maximum: 599
});

const ErrorTitleSchema = Type.String({
  description: 'A short, human-readable summary of the problem type',
  maxLength: 1024
});

const ErrorDetailSchema = Type.String({
  description: 'A human-readable explanation specific to this occurrence of the problem',
  maxLength: 4096
});

const ErrorInstanceSchema = Type.String({
  description: 'A URI reference that identifies the specific occurrence of the problem',
  format: 'uri',
  maxLength: 1024
});

const ErrorCodeSchema = Type.String({
  description: 'An API-specific error code',
  format: 'uri',
  maxLength: 50
});

const ErrorsSchema = Type.Array(
  Type.Object(
    {
      detail: ErrorsDetailSchema,
      pointer: Type.Optional(ErrorsPointerSchema),
      parameter: Type.Optional(ErrorsParameterSchema),
      header: Type.Optional(ErrorsHeaderSchema),
      code: Type.Optional(ErrorsCodeSchema)
    },
    { description: 'An error detail object' }
  )
);

/* Loosely follows RFC 9457
 * https://datatracker.ietf.org/doc/html/rfc9457
 *
 * See also: https://swagger.io/blog/problem-details-rfc9457-api-error-handling/
 */
const ErrorSchema = Type.Object({
  type: Type.Optional(ErrorTypeSchema),
  status: ErrorStatusSchema,
  title: Type.Optional(ErrorTitleSchema),
  detail: ErrorDetailSchema,
  instance: Type.Optional(ErrorInstanceSchema),
  code: Type.Optional(ErrorCodeSchema),
  errors: Type.Optional(ErrorsSchema)
});

type ErrorSchemaType = Static<typeof ErrorSchema>;

export { ErrorSchema, type ErrorSchemaType };
