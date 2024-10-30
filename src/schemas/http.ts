import { type TObject, type TSchema, Type } from '@sinclair/typebox';
import { PaginationDefaults } from '../utils/constants/constants';
import { NaturalNumberSchema } from './data';

const NoContentSchema = Type.Object({});

const genPaginatedDataSchema = <TData extends TSchema>(dataSchema: TData): TObject =>
  Type.Object({
    data: Type.Array(dataSchema),
    page: NaturalNumberSchema,
    pageSize: NaturalNumberSchema,
    totalCount: NaturalNumberSchema
  });

const PaginationParamsSchema = Type.Object({
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
  pattern:
    '^[a-zA-Z0-9_]+:(?:[a-zA-Z0-9_]+|\\d{4}-\\d{2}-\\d{2})(\\|[a-zA-Z0-9_]+|\\|\\d{4}-\\d{2}-\\d{2})*(,[a-zA-Z0-9_]+:(?:[a-zA-Z0-9_]+|\\d{4}-\\d{2}-\\d{2})(\\|[a-zA-Z0-9_]+|\\|\\d{4}-\\d{2}-\\d{2})*)*$',
  title: 'A string to filter the data by',
  description:
    'A string to filter the data by.\n' +
    'The format is `key:value` or `key:value|value` for arrays.\n' +
    'Multiple filters can be separated by commas.'
});

const SortStringSchema = Type.String({
  pattern: '^[a-zA-Z0-9_]+:(asc|desc)(,[a-zA-Z0-9_]+:(asc|desc))*$',
  title: 'A string to sort the data by',
  description:
    'A string to sort the data by.\n' +
    'The format is `key:asc` or `key:desc`.\n' +
    'Multiple sorts can be separated by commas.'
});

export {
  FilterStringSchema,
  genPaginatedDataSchema,
  NoContentSchema,
  PaginationParamsSchema,
  SortStringSchema
};
