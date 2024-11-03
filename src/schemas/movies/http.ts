import { type Static, Type } from '@sinclair/typebox';
import type { FastifySchema } from 'fastify';
import { HttpMediaTypes, HttpStatusCodes, SecuritySchemes } from '../../utils/constants/enums';
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
  produces: [HttpMediaTypes.JSON, HttpMediaTypes.HAL_JSON],
  querystring: PaginatedSearchSchema,
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema), true),
    ...createEmptyResponseSchema(HttpStatusCodes.NotModified),
    ...createErrorResponseSchemas([HttpStatusCodes.BadRequest, HttpStatusCodes.InternalServerError])
  }
};

const CreateMovieSchema: FastifySchema = {
  summary: 'Create a new movie',
  body: MovieSchema,
  security: [{ [SecuritySchemes.BearerAuth]: [] }],
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.Created, IdObjectSchema),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.Conflict,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const FetchMovieSchema: FastifySchema = {
  summary: 'Fetch a single movie by ID',
  params: MovieIdObjectSchema,
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema)),
    ...createEmptyResponseSchema(HttpStatusCodes.NotModified),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const FetchMovieCommentsSchema: FastifySchema = {
  summary: 'Fetch comments for a movie with pagination, filtering, and sorting',
  params: MovieIdObjectSchema,
  querystring: PaginatedSearchSchema,
  response: {
    ...createJsonResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieCommentSchema), true),
    ...createEmptyResponseSchema(HttpStatusCodes.NotModified),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const CreateMovieCommentSchema: FastifySchema = {
  summary: 'Create a new comment for a movie',
  params: MovieIdObjectSchema,
  body: MovieCommentInputSchema,
  security: [{ [SecuritySchemes.BearerAuth]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.Created),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const ReplaceMovieSchema: FastifySchema = {
  summary: 'Update a movie by ID with a new movie representation',
  params: MovieIdObjectSchema,
  body: MovieSchema,
  security: [{ [SecuritySchemes.BearerAuth]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.NoContent),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const UpdateMovieSchema: FastifySchema = {
  summary: 'Update a movie by ID with a partial movie representation',
  params: MovieIdObjectSchema,
  body: PartialMovieSchema,
  security: [{ [SecuritySchemes.BearerAuth]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.NoContent),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const DeleteMovieSchema: FastifySchema = {
  summary: 'Delete a movie by ID',
  params: MovieIdObjectSchema,
  security: [{ [SecuritySchemes.BearerAuth]: [] }],
  response: {
    ...createEmptyResponseSchema(HttpStatusCodes.NoContent),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
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
