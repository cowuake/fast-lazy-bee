import { type Static, Type } from '@sinclair/typebox';
import { StringSchema, StringArraySchema, FloatSchema, NaturalSchema, UriSchema } from '../common';

const MovieYearSchema = Type.Integer({ minimum: 1878 });

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
  title: { ...StringSchema, description: 'The title of the movie' },
  type: StringSchema,
  year: { ...MovieYearSchema, description: 'The year the movie was released' }
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

const IdSchema = Type.String({ description: 'The unique identifier of the resource' });
const MovieIdSchema = { ...IdSchema, description: 'The unique identifier of the movie' };
const MovieCommentIdSchema = {
  ...IdSchema,
  description: 'The unique identifier of the movie comment'
};

const MovieSchema = Type.Object({
  ...MovieMandatoryFieldsSchema.properties,
  ...MovieOptionalFieldsSchema.properties
});

const PartialMovieSchema = Type.Partial(MovieSchema);

const MovieWithIdSchema = Type.Object({
  ...MovieSchema.properties,
  ...{ id: MovieIdSchema }
});

const MovieCommentSchema = Type.Partial(
  Type.Object({
    name: StringSchema,
    email: StringSchema,
    movie_id: MovieIdSchema,
    text: StringSchema,
    date: StringSchema
  })
);

const MovieCommentWithIdSchema = Type.Object({
  ...MovieCommentSchema.properties,
  ...{ id: MovieCommentIdSchema }
});

type MovieSchemaType = Static<typeof MovieSchema>;
type MovieWithIdSchemaType = Static<typeof MovieWithIdSchema>;
type MovieCommentSchemaType = Static<typeof MovieCommentSchema>;

export {
  IdSchema,
  MovieIdSchema,
  MovieCommentIdSchema,
  MovieSchema,
  MovieYearSchema,
  MovieWithIdSchema,
  PartialMovieSchema,
  MovieCommentSchema,
  MovieCommentWithIdSchema,
  type MovieSchemaType,
  type MovieWithIdSchemaType,
  type MovieCommentSchemaType
};
