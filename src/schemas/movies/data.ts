import { type Static, Type } from '@sinclair/typebox';

const MovieMandatoryFieldsSchema = Type.Object({
  title: Type.String(),
  type: Type.String()
});

const MovieOptionalFieldsSchema = Type.Partial(
  Type.Object({
    awards: Type.Object({
      wins: Type.Number(),
      nominations: Type.Number(),
      text: Type.String()
    }),
    cast: Type.Array(Type.String()),
    countries: Type.Array(Type.String()),
    directors: Type.Array(Type.String()),
    fullplot: Type.String(),
    genres: Type.Array(Type.String()),
    imdb: Type.Partial(
      Type.Object({
        id: Type.String(),
        rating: Type.Number(),
        votes: Type.Number()
      })
    ),
    languages: Type.Array(Type.String()),
    lastupdated: Type.String(),
    metacritic: Type.Number(),
    num_mflix_comments: Type.Number(),
    plot: Type.String(),
    poster: Type.String(),
    rated: Type.String(),
    released: Type.String(),
    runtime: Type.Number(),
    tomatoes: Type.Partial(
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
    writers: Type.Array(Type.String()),
    year: Type.Any()
  })
);

export const MovieIdSchema = Type.String({
  description: 'The unique identifier of the movie'
});

export const MovieSchema = Type.Object({
  ...MovieMandatoryFieldsSchema.properties,
  ...MovieOptionalFieldsSchema.properties
});

export const MovieWithIdSchema = Type.Object({
  ...MovieSchema.properties,
  ...{ id: MovieIdSchema }
});
export const MovieListSchema = Type.Array(MovieWithIdSchema);

export type MovieSchemaType = Static<typeof MovieSchema>;
export type MovieWithIdSchemaType = Static<typeof MovieWithIdSchema>;
export type MovieListSchemaType = Static<typeof MovieListSchema>;
