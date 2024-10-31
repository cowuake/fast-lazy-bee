import { type Static, type TObject, Type } from '@sinclair/typebox';
import { PaginationConstants } from '../utils/constants/constants';
import { NaturalNumberSchema } from './data';
import { IdSchema, KeySchema } from './movies/data';

const NoContentSchema = Type.Object({});

const ResourceSchema = <TData extends TObject>(dataSchema: TData): TObject =>
  Type.Object({ _id: IdSchema, ...dataSchema.properties });

const CollectionSchema = <TData extends TObject>(dataSchema: TData): TObject =>
  Type.Object({
    data: Type.Array(ResourceSchema(dataSchema))
  });

const PaginationSchema = Type.Object({
  page: NaturalNumberSchema,
  pageSize: NaturalNumberSchema,
  totalCount: NaturalNumberSchema
});

const PaginatedCollectionSchema = <TData extends TObject>(dataSchema: TData): TObject =>
  Type.Object({ ...CollectionSchema(dataSchema).properties, ...PaginationSchema.properties });

const PaginationParamsSchema = Type.Object({
  page: Type.Integer({
    description: 'The page number to retrieve',
    default: PaginationConstants.defaultPageNumber,
    minimum: PaginationConstants.minimumPageNumber
  }),
  pageSize: Type.Integer({
    description: 'The number of items to retrieve per page',
    default: PaginationConstants.defaultPageSize,
    minimum: PaginationConstants.minimumPageSize,
    maximum: PaginationConstants.maximumPageSize
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

const LinkSchema = Type.Object({
  href: Type.String({ format: 'uri' })
});

const LinksSchema = Type.Optional(Type.Record(KeySchema, LinkSchema));

const CollectionWithLinksSchema = <TData extends TObject>(dataSchema: TData): TObject =>
  Type.Object({
    ...CollectionSchema(dataSchema).properties,
    _links: LinksSchema
  });

const ResourceWithLinksSchema = <TData extends TObject>(dataSchema: TData): TObject =>
  Type.Object({
    ...ResourceSchema(dataSchema).properties,
    _links: LinksSchema
  });

const PaginatedCollectionWithLinksSchema = <TData extends TObject>(dataSchema: TData): TObject =>
  Type.Object({
    ...PaginatedCollectionSchema(ResourceWithLinksSchema(dataSchema)).properties,
    ...CollectionWithLinksSchema(ResourceWithLinksSchema(dataSchema)).properties
  });

type LinksSchemaType = Static<typeof LinksSchema>;
type CollectionWithLinksSchemaType<T extends TObject> = Static<
  ReturnType<typeof CollectionWithLinksSchema<T>>
>;
type PaginatedCollectionSchemaType<T extends TObject> = Static<
  ReturnType<typeof PaginatedCollectionSchema<T>>
>;
type PaginatedCollectionWithLinksSchemaType<T extends TObject> = Static<
  ReturnType<typeof PaginatedCollectionWithLinksSchema<T>>
>;
type ResourceSchemaType<T extends TObject> = Static<ReturnType<typeof ResourceSchema<T>>>;

export {
  CollectionWithLinksSchema,
  FilterStringSchema,
  NoContentSchema,
  PaginatedCollectionSchema,
  PaginatedCollectionWithLinksSchema,
  PaginationParamsSchema,
  ResourceSchema,
  ResourceWithLinksSchema,
  SortStringSchema,
  type CollectionWithLinksSchemaType,
  type LinksSchemaType,
  type PaginatedCollectionSchemaType,
  type PaginatedCollectionWithLinksSchemaType,
  type ResourceSchemaType
};
