import { type Static, Type } from '@sinclair/typebox';
import type { FastifySchema } from 'fastify';
import { HttpStatusCodes, SecuritySchemes } from '../../utils/constants/enums';
import {
  createEmptyResponseSchema,
  createErrorResponseSchemas,
  createJsonResponseSchema
} from '../../utils/routing-utils';
import {
  FilterStringSchema,
  PaginationParamsSchema,
  ResourceSchema,
  SortStringSchema
} from '../http';
import {
  IdSchema,
  MovieCommentInputSchema,
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
  _id: IdSchema
});

const MovieIdObjectSchema = Type.Object({
  movie_id: MovieIdSchema
});

const FetchMoviesSchema: FastifySchema = {
  summary: 'Fetch movies with pagination, filtering, and sorting',
  querystring: PaginatedSearchSchema,
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema), true),
    ...createEmptyResponseSchema(HttpStatusCodes.NOT_MODIFIED),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

const CreateMovieSchema: FastifySchema = {
  summary: 'Create a new movie',
  body: MovieSchema,
  security: [{ [SecuritySchemes.BEARER_AUTH]: [] }],
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.CREATED, IdObjectSchema),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.UNAUTHORIZED,
      HttpStatusCodes.CONFLICT,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

const FetchMovieSchema: FastifySchema = {
  summary: 'Fetch a single movie from the ID location',
  params: MovieIdObjectSchema,
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema)),
    ...createEmptyResponseSchema(HttpStatusCodes.NOT_MODIFIED),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.NOT_FOUND,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

const FetchMovieCommentsSchema: FastifySchema = {
  summary: 'Fetch comments for a movie with pagination, filtering, and sorting',
  params: MovieIdObjectSchema,
  querystring: PaginatedSearchSchema,
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieCommentSchema), true),
    ...createEmptyResponseSchema(HttpStatusCodes.NOT_MODIFIED),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.NOT_FOUND,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

const CreateMovieCommentSchema: FastifySchema = {
  summary: 'Create a new comment for a movie',
  params: MovieIdObjectSchema,
  body: MovieCommentInputSchema,
  security: [{ [SecuritySchemes.BEARER_AUTH]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.CREATED),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.UNAUTHORIZED,
      HttpStatusCodes.NOT_FOUND,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

const ReplaceMovieSchema: FastifySchema = {
  summary: 'Replace movie at the ID location with a new movie representation',
  params: MovieIdObjectSchema,
  body: MovieSchema,
  security: [{ [SecuritySchemes.BEARER_AUTH]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.NO_CONTENT),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.UNAUTHORIZED,
      HttpStatusCodes.NOT_FOUND,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

const UpdateMovieSchema: FastifySchema = {
  summary: 'Update movie at the ID location with a partial movie representation',
  params: MovieIdObjectSchema,
  body: PartialMovieSchema,
  security: [{ [SecuritySchemes.BEARER_AUTH]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.NO_CONTENT),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.UNAUTHORIZED,
      HttpStatusCodes.NOT_FOUND,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

const DeleteMovieSchema: FastifySchema = {
  summary: 'Delete movie at the ID location',
  params: MovieIdObjectSchema,
  security: [{ [SecuritySchemes.BEARER_AUTH]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.NO_CONTENT),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BAD_REQUEST,
      HttpStatusCodes.UNAUTHORIZED,
      HttpStatusCodes.NOT_FOUND,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ])
  }
};

type CollectionSearchSchemaType = Static<typeof CollectionSearchSchema>;
type PaginatedSearchSchemaType = Static<typeof PaginatedSearchSchema>;

type MovieIdObjectSchemaType = Static<typeof MovieIdObjectSchema>;
type MovieCommentIdObjectSchemaType = Static<typeof MovieIdObjectSchema>;

export {
  CreateMovieCommentSchema,
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
