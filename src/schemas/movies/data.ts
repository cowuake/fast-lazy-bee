import { type Static, Type } from '@sinclair/typebox';

const StringSchema = Type.String({ minLength: 1 });
const StringArraySchema = Type.Array(StringSchema, { minItems: 1 });
const FloatSchema = Type.Number({ format: 'float' });
const NaturalSchema = Type.Integer({ minimum: 0, default: 0 });
const UriSchema = Type.String({ format: 'uri' });

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
  viewer: Type.Object({
    meter: NaturalSchema,
    numReviews: NaturalSchema,
    rating: FloatSchema
  }),
  lastUpdated: StringSchema
});

const MovieMandatoryFieldsSchema = Type.Object({
  title: StringSchema,
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
