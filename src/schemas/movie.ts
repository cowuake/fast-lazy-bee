import { type Static, Type } from '@sinclair/typebox';
import { PaginationDefaults } from '../utils/constants';

export const MovieSchema = Type.Object({
  awards: Type.Optional(
    Type.Object({
      wins: Type.Number(),
      nominations: Type.Number(),
      text: Type.String()
    })
  ),
  cast: Type.Optional(Type.Array(Type.String())),
  countries: Type.Optional(Type.Array(Type.String())),
  directors: Type.Optional(Type.Array(Type.String())),
  fullplot: Type.Optional(Type.String()),
  genres: Type.Optional(Type.Array(Type.String())),
  imdb: Type.Partial(
    Type.Object({
      id: Type.String(),
      rating: Type.Number(),
      votes: Type.Number()
    })
  ),
  languages: Type.Optional(Type.Array(Type.String())),
  lastupdated: Type.String(),
  metacritic: Type.Optional(Type.Number()),
  num_mflix_comments: Type.Number(),
  plot: Type.Optional(Type.String()),
  poster: Type.Optional(Type.String()),
  rated: Type.Optional(Type.String()),
  released: Type.Optional(Type.String()),
  runtime: Type.Optional(Type.Number()),
  title: Type.String(),
  tomatoes: Type.Optional(
    Type.Object({
      viewer: Type.Optional(
        Type.Partial(
          Object({
            meter: Type.Number(),
            numReviews: Type.Number(),
            rating: Type.Number()
          })
        )
      ),
      lastUpdated: Type.String()
    })
  ),
  type: Type.String(),
  writers: Type.Optional(Type.Array(Type.String())),
  year: Type.Any()
});

export const MovieListSchema = Type.Array(MovieSchema);

export const MovieListResponseSchema = Type.Object({
  movies: MovieListSchema,
  total: Type.Number()
});

export const GetMoviesQuerySchema = Type.Object({
  title: Type.Optional(Type.String()),
  page: Type.Integer({
    default: PaginationDefaults.defaultPageNumber,
    minimum: PaginationDefaults.minimumPageNumber
  }),
  size: Type.Integer({
    default: PaginationDefaults.maximumPageSize,
    minimum: PaginationDefaults.minimumPageSize,
    maximum: PaginationDefaults.maximumPageSize
  })
});

export const CompleteMovieRequestBodySchema = MovieSchema;
export const PartialMovieRequestBodySchema = Type.Partial(CompleteMovieRequestBodySchema);
export const CreateMovieResponseBodySchema = Type.Object({
  id: Type.String()
});

export const MovieByIdParamsSchema = Type.Object({
  id: Type.String()
});
export const GetMovieResponseBodySchema = MovieSchema;

export type MovieSchemaType = Static<typeof MovieSchema>;
export type MovieListSchemaType = Static<typeof MovieListSchema>;
export type MovieListResponseSchemaType = Static<typeof MovieListResponseSchema>;

export type GetMoviesQuerySchemaType = Static<typeof GetMoviesQuerySchema>;
export type CreateMovieBodySchemaType = Static<typeof CompleteMovieRequestBodySchema>;
export type ReplaceMovieBodySchemaType = Static<typeof CompleteMovieRequestBodySchema>;
export type UpdateMovieBodySchemaType = Static<typeof PartialMovieRequestBodySchema>;

export type MovieByIdParamsSchemaType = Static<typeof MovieByIdParamsSchema>;
