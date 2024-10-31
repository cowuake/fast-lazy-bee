import { type Static, Type } from '@sinclair/typebox';
import type { FastifySchema } from 'fastify';
import { RouteTags } from '../../utils/constants/constants';
import { HttpMediaTypes, HttpStatusCodes } from '../../utils/constants/enums';
import { createResponseSchema } from '../../utils/schema-utils';
import { ErrorSchema } from '../errors';
import {
  FilterStringSchema,
  NoContentSchema,
  PaginationParamsSchema,
  ResourceSchema,
  SortStringSchema
} from '../http';
import {
  IdSchema,
  MovieCommentSchema,
  MovieIdSchema,
  MovieSchema,
  PartialMovieSchema
} from './data';

const CollectionFilterSchema = Type.Object({
  filter: Type.Optional(FilterStringSchema)
});

const CollectionSortSchema = Type.Object({
  sort: Type.Optional(SortStringSchema)
});

const CollectionSearchSchema = Type.Object({
  ...CollectionFilterSchema.properties,
  ...CollectionSortSchema.properties
});

const PaginatedSearchSchema = Type.Object({
  ...CollectionSearchSchema.properties,
  ...PaginationParamsSchema.properties
});

const IdObjectSchema = Type.Object({
  id: IdSchema
});

const MovieIdObjectSchema = Type.Object({
  movie_id: MovieIdSchema
});

const FetchMoviesSchema: FastifySchema = {
  produces: [HttpMediaTypes.JSON, HttpMediaTypes.HAL_JSON],
  tags: [RouteTags.movies, RouteTags.cache],
  querystring: PaginatedSearchSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema), true),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const CreateMovieSchema: FastifySchema = {
  tags: [RouteTags.movies],
  body: MovieSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.Created, IdObjectSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.Conflict, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const FetchMovieSchema: FastifySchema = {
  tags: [RouteTags.movie, RouteTags.cache],
  params: MovieIdObjectSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema)),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const FetchMovieCommentsSchema: FastifySchema = {
  tags: [RouteTags.comments, RouteTags.cache],
  params: MovieIdObjectSchema,
  querystring: PaginatedSearchSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieCommentSchema), true),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const ReplaceMovieSchema: FastifySchema = {
  tags: [RouteTags.movie],
  params: MovieIdObjectSchema,
  body: MovieSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.NoContent, NoContentSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const UpdateMovieSchema: FastifySchema = {
  tags: [RouteTags.movie],
  params: MovieIdObjectSchema,
  body: PartialMovieSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.NoContent, NoContentSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const DeleteMovieSchema: FastifySchema = {
  tags: [RouteTags.movie],
  params: MovieIdObjectSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.NoContent, NoContentSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

type CollectionSearchSchemaType = Static<typeof CollectionSearchSchema>;
type PaginatedSearchSchemaType = Static<typeof PaginatedSearchSchema>;

type MovieIdObjectSchemaType = Static<typeof MovieIdObjectSchema>;
type MovieCommentIdObjectSchemaType = Static<typeof MovieIdObjectSchema>;

export {
  CreateMovieSchema,
  DeleteMovieSchema,
  FetchMovieCommentsSchema,
  FetchMovieSchema,
  FetchMoviesSchema,
  MovieIdObjectSchema,
  ReplaceMovieSchema,
  UpdateMovieSchema,
  type CollectionSearchSchemaType,
  type MovieCommentIdObjectSchemaType,
  type MovieIdObjectSchemaType,
  type PaginatedSearchSchemaType
};
