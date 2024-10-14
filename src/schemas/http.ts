import { type TNull, type TObject, type TSchema, Type } from '@sinclair/typebox';

const HttpRequestSchema = <
  TBody extends TSchema | TNull,
  THeader extends TSchema | TNull,
  TParam extends TSchema | TNull,
  TQuery extends TSchema | TNull
>(
  bodySchema: TBody,
  headerSchema: THeader,
  paramsSchema: TParam,
  querySchema: TQuery
): TObject =>
  Type.Partial(
    Type.Object({
      body: bodySchema,
      headers: headerSchema,
      params: paramsSchema,
      querystring: querySchema
    })
  );

const HttpResponseSchema = <TBody extends TSchema, THeader extends TSchema>(
  bodySchema: TBody,
  headerSchema: THeader
): TObject =>
  Type.Object({
    body: bodySchema,
    headers: headerSchema
  });

const NoContentSchema = Type.Object({});

export { HttpRequestSchema, HttpResponseSchema, NoContentSchema };
