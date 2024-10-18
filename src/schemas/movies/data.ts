import { type Static, Type } from '@sinclair/typebox';
import { StringSchema, StringArraySchema, FloatSchema, NaturalSchema, UriSchema } from '../common';

const AwardsSchema = Type.Object({
  wins: NaturalSchema,
  nominations: NaturalSchema,
  text: StringSchema
});

const ImdbSchema = Type.Object({
  id: StringSchema,
  rating: FloatSchema,
  votes: NaturalSchema
});

const TomatoesSchema = Type.Object({
  viewer: Type.Partial(
    Type.Object({
      meter: NaturalSchema,
      numReviews: NaturalSchema,
      rating: FloatSchema
    })
  ),
  lastUpdated: StringSchema
});

const MovieMandatoryFieldsSchema = Type.Object({
  title: { ...StringSchema },
  type: StringSchema,
  year: NaturalSchema
});

const MovieOptionalFieldsSchema = Type.Partial(
  Type.Object({
    awards: AwardsSchema,
    cast: StringArraySchema,
    countries: StringArraySchema,
    directors: StringArraySchema,
    fullplot: StringSchema,
    imdb: Type.Partial(ImdbSchema),
    languages: StringArraySchema,
    lastupdated: StringSchema,
    metacritic: Type.Number(),
    num_mflix_comments: NaturalSchema,
    plot: StringSchema,
    poster: UriSchema,
    rated: StringSchema,
    released: StringSchema,
    runtime: NaturalSchema,
    tomatoes: Type.Partial(TomatoesSchema),
    writers: StringArraySchema
  })
);

const MovieIdSchema = Type.String({
  description: 'The unique identifier of the movie'
});

const MovieSchema = Type.Object({
  ...MovieMandatoryFieldsSchema.properties,
  ...MovieOptionalFieldsSchema.properties
});

const PartialMovieSchema = Type.Partial(MovieSchema);

const MovieWithIdSchema = Type.Object({
  ...MovieSchema.properties,
  ...{ id: MovieIdSchema }
});

type MovieSchemaType = Static<typeof MovieSchema>;
type MovieWithIdSchemaType = Static<typeof MovieWithIdSchema>;

export {
  MovieIdSchema,
  MovieSchema,
  PartialMovieSchema,
  MovieWithIdSchema,
  type MovieSchemaType,
  type MovieWithIdSchemaType
};
