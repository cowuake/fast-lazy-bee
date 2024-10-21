import { type Static, Type } from '@sinclair/typebox';
import { RouteTags } from '../../utils/constants/constants';
import {
  NoContentSchema,
  PaginatedDataSchema,
  PaginationFilterSchema,
  SortStringSchema
} from '../http';
import { MovieSchema, MovieWithIdSchema, PartialMovieSchema } from './data';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { createResponseSchema } from '../../utils/schema-utils';
import { ErrorSchema } from '../errors';
import type { FastifySchema } from 'fastify';

const PaginatedMoviesSchema = PaginatedDataSchema(MovieWithIdSchema);

const MovieFilterSchema = Type.Object({
  title: Type.Optional(MovieSchema.properties.title),
  year: Type.Optional(MovieSchema.properties.year),
  sort: Type.Optional(SortStringSchema),
  ...PaginationFilterSchema.properties
});

const MovieIdObjectSchema = Type.Object({
  id: Type.String({ description: 'The unique identifier of the movie' })
});

const ListMoviesSchema: FastifySchema = {
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
    ...createResponseSchema(HttpStatusCodes.Created, MovieIdObjectSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const FetchMovieSchema: FastifySchema = {
  tags: [RouteTags.movies, RouteTags.cache],
  params: MovieIdObjectSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, MovieWithIdSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

const ReplaceMovieSchema: FastifySchema = {
  tags: [RouteTags.movies],
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
  tags: [RouteTags.movies],
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
  tags: [RouteTags.movies],
  params: MovieIdObjectSchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.NoContent, NoContentSchema),
    ...createResponseSchema(HttpStatusCodes.BadRequest, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.NotFound, ErrorSchema),
    ...createResponseSchema(HttpStatusCodes.InternalServerError, ErrorSchema)
  }
};

type MovieIdObjectSchemaType = Static<typeof MovieIdObjectSchema>;
type MovieQuerySchemaType = Static<typeof MovieFilterSchema>;
type MovieFilterSchemaType = Static<typeof MovieFilterSchema>;
type PaginatedMoviesSchemaType = Static<typeof PaginatedMoviesSchema>;

export {
  MovieIdObjectSchema,
  ListMoviesSchema,
  CreateMovieSchema,
  FetchMovieSchema,
  ReplaceMovieSchema,
  UpdateMovieSchema,
  DeleteMovieSchema,
  type MovieIdObjectSchemaType,
  type MovieQuerySchemaType,
  type MovieFilterSchemaType,
  type PaginatedMoviesSchemaType
};
