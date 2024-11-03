import { type Static, Type } from '@sinclair/typebox';
import type { FastifySchema } from 'fastify';
import {
  HttpMediaTypes,
  HttpStatusCodes,
  RouteTags,
  SecuritySchemes
} from '../../utils/constants/enums';
import {
  createEmptyResponseSchema,
  createErrorResponseSchemas,
  createResponseSchema
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
  produces: [HttpMediaTypes.JSON, HttpMediaTypes.HAL_JSON],
  tags: [RouteTags.Movies, RouteTags.Cache],
  querystring: PaginatedSearchSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema), true),
    ...createEmptyResponseSchema(HttpStatusCodes.NotModified),
    ...createErrorResponseSchemas([HttpStatusCodes.BadRequest, HttpStatusCodes.InternalServerError])
  }
};

const CreateMovieSchema: FastifySchema = {
  tags: [RouteTags.Movies],
  body: MovieSchema,
  security: [{ [SecuritySchemes.BearerAuth]: [] }],
  response: {
    ...createResponseSchema(HttpStatusCodes.Created, IdObjectSchema),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.Unauthorized,
      HttpStatusCodes.Conflict,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const FetchMovieSchema: FastifySchema = {
  tags: [RouteTags.Movie, RouteTags.Cache],
  params: MovieIdObjectSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieSchema)),
    ...createEmptyResponseSchema(HttpStatusCodes.NotModified),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const FetchMovieCommentsSchema: FastifySchema = {
  tags: [RouteTags.Comments, RouteTags.Cache],
  params: MovieIdObjectSchema,
  querystring: PaginatedSearchSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, ResourceSchema(MovieCommentSchema), true),
    ...createEmptyResponseSchema(HttpStatusCodes.NotModified),
    ...createErrorResponseSchemas([
      HttpStatusCodes.BadRequest,
      HttpStatusCodes.NotFound,
      HttpStatusCodes.InternalServerError
    ])
  }
};

const CreateMovieCommentSchema: FastifySchema = {
  tags: [RouteTags.Comments],
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
  tags: [RouteTags.Movie],
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
  tags: [RouteTags.Movie],
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
  tags: [RouteTags.Movie],
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
