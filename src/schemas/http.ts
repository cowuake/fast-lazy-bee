import { type TObject, type TSchema, Type } from '@sinclair/typebox';
import { NaturalSchema } from './common';
import { PaginationDefaults } from '../utils/constants/constants';

// const HttpRequestSchema = <
//   TBody extends TSchema | TNull,
//   THeader extends TSchema | TNull,
//   TParam extends TSchema | TNull,
//   TQuery extends TSchema | TNull
// >(
//   bodySchema: TBody,
//   headerSchema: THeader,
//   paramsSchema: TParam,
//   querySchema: TQuery
// ): TObject =>
//   Type.Partial(
//     Type.Object({
//       body: bodySchema,
//       headers: headerSchema,
//       params: paramsSchema,
//       querystring: querySchema
//     })
//   );

// const HttpResponseSchema = <TBody extends TSchema, THeader extends TSchema>(
//   bodySchema: TBody,
//   headerSchema: THeader
// ): TObject =>
//   Type.Object({
//     body: bodySchema,
//     headers: headerSchema
//   });

const NoContentSchema = Type.Object({});

const PaginatedDataSchema = <TData extends TSchema>(dataSchema: TData): TObject =>
  Type.Object({
    data: Type.Array(dataSchema),
    page: NaturalSchema,
    pageSize: NaturalSchema,
    totalCount: NaturalSchema
  });

const PaginationFilterSchema = Type.Object({
  page: Type.Integer({
    description: 'The page number to retrieve',
    default: PaginationDefaults.defaultPageNumber,
    minimum: PaginationDefaults.minimumPageNumber
  }),
  pageSize: Type.Integer({
    description: 'The number of items to retrieve per page',
    default: PaginationDefaults.defaultPageSize,
    minimum: PaginationDefaults.minimumPageSize,
    maximum: PaginationDefaults.maximumPageSize
  })
});

const SortStringSchema = Type.String({
  pattern: '^[a-zA-Z0-9_]+:(asc|desc)(,[a-zA-Z0-9_]+:(asc|desc))*$',
  description: 'A comma-separated list of fields to sort by, with their respective order'
});

export {
  // HttpRequestSchema,
  // HttpResponseSchema,
  NoContentSchema,
  PaginatedDataSchema,
  PaginationFilterSchema,
  SortStringSchema
};
