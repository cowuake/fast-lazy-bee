import { type TObject, type TSchema, Type } from '@sinclair/typebox';
import { NaturalSchema } from './common';
import { PaginationDefaults } from '../utils/constants/constants';

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

const FilterStringSchema = Type.String({
  pattern: '^[a-zA-Z0-9_]+:[^,]+(,[a-zA-Z0-9_]+:[^,]+)*$',
  description: 'A string to filter the data by'
});

const SortStringSchema = Type.String({
  pattern: '^[a-zA-Z0-9_]+:(asc|desc)(,[a-zA-Z0-9_]+:(asc|desc))*$',
  description: 'A comma-separated list of fields to sort by, with their respective order'
});

export {
  NoContentSchema,
  PaginatedDataSchema,
  PaginationFilterSchema,
  FilterStringSchema,
  SortStringSchema
};
