import { type Static, Type } from '@sinclair/typebox';
import { PaginationDefaults } from '../../utils/constants';
import { HttpRequestSchema, HttpResponseSchema } from '../http';
import { MovieListSchema, MovieSchema } from './data';

const ListMoviesResponseBodySchema = Type.Object({
  movies: MovieListSchema,
  total: Type.Number()
});

const ListMoviesQuerySchema = Type.Object({
  title: Type.Optional(Type.String()),
  page: Type.Integer({
    default: PaginationDefaults.defaultPageNumber,
    minimum: PaginationDefaults.minimumPageNumber
  }),
  size: Type.Integer({
    default: PaginationDefaults.defaultPageSize,
    minimum: PaginationDefaults.minimumPageSize,
    maximum: PaginationDefaults.maximumPageSize
  })
});

const CreateMovieResponseBodySchema = Type.Object({
  id: Type.String()
});

const MovieByIdParamsSchema = Type.Object({
  id: Type.String()
});

const CompleteMovieRequestBodySchema = MovieSchema;
const PartialMovieRequestBodySchema = Type.Partial(CompleteMovieRequestBodySchema);

export type MovieQuerySchemaType = Static<typeof ListMoviesQuerySchema>;

export const ListMoviesRequestSchema = HttpRequestSchema(
  Type.Undefined(),
  Type.Undefined(),
  Type.Undefined(),
  ListMoviesQuerySchema
);
export type ListMoviesRequestSchemaType = Static<typeof ListMoviesRequestSchema>;
export const ListMoviesResponseSchema = HttpResponseSchema(
  ListMoviesResponseBodySchema,
  Type.Undefined()
);
export type ListMoviesResponseSchemaType = Static<typeof ListMoviesResponseSchema>;

export const CreateMovieRequestSchema = HttpRequestSchema(
  MovieSchema,
  Type.Undefined(),
  Type.Undefined(),
  Type.Undefined()
);
export const CreateMovieResponseSchema = HttpResponseSchema(
  CreateMovieResponseBodySchema,
  Type.Undefined()
);
export type CreateMovieRequestSchemaType = Static<typeof CreateMovieRequestSchema>;
export type CreateMovieResponseSchemaType = Static<typeof CreateMovieResponseSchema>;

export const FetchMovieRequestSchema = HttpRequestSchema(
  Type.Undefined(),
  Type.Undefined(),
  MovieByIdParamsSchema,
  Type.Undefined()
);
export const FetchMovieResponseSchema = HttpResponseSchema(MovieSchema, Type.Undefined());

export const ReplaceMovieRequestSchema = HttpRequestSchema(
  CompleteMovieRequestBodySchema,
  Type.Undefined(),
  MovieByIdParamsSchema,
  Type.Undefined()
);
export const ReplaceMovieResponseSchema = HttpResponseSchema(MovieSchema, Type.Undefined());

export const UpdateMovieRequestSchema = HttpRequestSchema(
  PartialMovieRequestBodySchema,
  Type.Undefined(),
  MovieByIdParamsSchema,
  Type.Undefined()
);
export const UpdateMovieResponseSchema = HttpResponseSchema(MovieSchema, Type.Undefined());

export const DeleteMovieRequestSchema = HttpRequestSchema(
  Type.Undefined(),
  Type.Undefined(),
  MovieByIdParamsSchema,
  Type.Undefined()
);
export const DeleteMovieResponseSchema = HttpResponseSchema(Type.Undefined(), Type.Undefined());

export type ListMoviesQuerySchemaType = Static<typeof ListMoviesQuerySchema>;
export type CreateMovieBodySchemaType = Static<typeof CompleteMovieRequestBodySchema>;
export type ReplaceMovieBodySchemaType = Static<typeof CompleteMovieRequestBodySchema>;
export type UpdateMovieBodySchemaType = Static<typeof PartialMovieRequestBodySchema>;

export type MovieByIdParamsSchemaType = Static<typeof MovieByIdParamsSchema>;
