import { type Static, Type } from '@sinclair/typebox';
import { RouteTags } from '../../utils/constants/constants';
import {
  FilterStringSchema,
  NoContentSchema,
  genPaginatedDataSchema,
  PaginationFilterSchema,
  SortStringSchema
} from '../http';
import {
  IdSchema,
  MovieCommentWithIdSchema,
  MovieIdSchema,
  MovieSchema,
  MovieWithIdSchema,
  PartialMovieSchema
} from './data';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { createResponseSchema } from '../../utils/schema-utils';
import { ErrorSchema } from '../errors';
import type { FastifySchema } from 'fastify';

const PaginatedMoviesSchema = genPaginatedDataSchema(MovieWithIdSchema);
const PaginatedMovieCommentsSchema = genPaginatedDataSchema(MovieCommentWithIdSchema);

const GenericSearchSchema = Type.Object({
  search: Type.Optional(FilterStringSchema)
});

const GenericSortSchema = Type.Object({
  sort: Type.Optional(SortStringSchema)
});

const GenericFilterSchema = Type.Object({
  ...GenericSearchSchema.properties,
  ...GenericSortSchema.properties
});

const PaginatedGenericFilterSchema = Type.Object({
  ...GenericFilterSchema.properties,
  ...PaginationFilterSchema.properties
});

const MovieFilterSchema = PaginatedGenericFilterSchema;
const MovieCommentFilterSchema = PaginatedGenericFilterSchema;

const IdObjectSchema = Type.Object({
  id: IdSchema
});

const MovieIdObjectSchema = Type.Object({
  movie_id: MovieIdSchema
});

const FetchMoviesSchema: FastifySchema = {
  tags: [RouteTags.movies, RouteTags.cache],
  querystring: MovieFilterSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, PaginatedMoviesSchema),
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
    ...createResponseSchema(HttpStatusCodes.OK, MovieWithIdSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const FetchMovieCommentsSchema: FastifySchema = {
  tags: [RouteTags.comments, RouteTags.cache],
  params: MovieIdObjectSchema,
  querystring: MovieCommentFilterSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, PaginatedMovieCommentsSchema),
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

type MovieIdObjectSchemaType = Static<typeof MovieIdObjectSchema>;
type MovieCommentIdObjectSchemaType = Static<typeof MovieIdObjectSchema>;
type MovieQuerySchemaType = Static<typeof MovieFilterSchema>;
type MovieFilterSchemaType = Static<typeof MovieFilterSchema>;
type PaginatedMoviesSchemaType = Static<typeof PaginatedMoviesSchema>;
type PaginatedGenericFilterSchemaType = Static<typeof PaginatedGenericFilterSchema>;
type MovieCommentFilterSchemaType = Static<typeof MovieCommentFilterSchema>;
type GenericFilterSchemaType = Static<typeof GenericFilterSchema>;

export {
  MovieIdObjectSchema,
  FetchMoviesSchema,
  CreateMovieSchema,
  FetchMovieSchema,
  ReplaceMovieSchema,
  UpdateMovieSchema,
  DeleteMovieSchema,
  FetchMovieCommentsSchema,
  type MovieIdObjectSchemaType,
  type MovieCommentIdObjectSchemaType,
  type MovieQuerySchemaType,
  type MovieFilterSchemaType,
  type PaginatedMoviesSchemaType,
  type PaginatedGenericFilterSchemaType,
  type MovieCommentFilterSchemaType,
  type GenericFilterSchemaType
};
