import { type Static, Type } from '@sinclair/typebox';

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

export const MovieWithIdSchema = Type.Object({
  ...MovieSchema.properties,
  _id: Type.String()
});

export const MovieListSchema = Type.Array(MovieWithIdSchema);

export type MovieSchemaType = Static<typeof MovieSchema>;
export type MovieWithIdSchemaType = Static<typeof MovieWithIdSchema>;
export type MovieListSchemaType = Static<typeof MovieListSchema>;
