import { type Static, Type } from '@sinclair/typebox';
import { PaginationDefaults, RouteTags } from '../../utils/constants';
import { NoContentSchema } from '../http';
import { MovieListSchema, MovieSchema, MovieWithIdSchema, PartialMovieSchema } from './data';
import { HttpStatusCodes } from '../../utils/enums';
import { createResponseSchema } from '../../utils/schema-utils';
import { ErrorSchema } from '../errors';
import type { FastifySchema } from 'fastify';

const MovieListWithCountSchema = Type.Object({
  movies: MovieListSchema,
  total: Type.Number()
});
const ListMoviesQuerySchema = Type.Object({
  title: Type.Optional(Type.String()),
  page: Type.Integer({
    description: 'The page number to retrieve',
    default: PaginationDefaults.defaultPageNumber,
    minimum: PaginationDefaults.minimumPageNumber
  }),
  size: Type.Integer({
    description: 'The number of items to retrieve per page',
    default: PaginationDefaults.defaultPageSize,
    minimum: PaginationDefaults.minimumPageSize,
    maximum: PaginationDefaults.maximumPageSize
  })
});

const MovieIdObjectSchema = Type.Object({
  id: Type.String({ description: 'The unique identifier of the movie' })
});

const ListMoviesSchema: FastifySchema = {
  tags: [RouteTags.movies, RouteTags.cache],
  querystring: ListMoviesQuerySchema,
  response: {
    ...createResponseSchema(HttpStatusCodes.OK, MovieListWithCountSchema),
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
type MovieQuerySchemaType = Static<typeof ListMoviesQuerySchema>;
type ListMoviesQuerySchemaType = Static<typeof ListMoviesQuerySchema>;

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
  type ListMoviesQuerySchemaType
};
