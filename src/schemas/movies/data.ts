import { type Static, Type } from '@sinclair/typebox';
import { MediaTypes } from '../../utils/constants/enums';
import {
  DateSchema,
  EmailSchema,
  FloatSchema,
  NaturalNumberSchema,
  StringArraySchema,
  StringSchema,
  UriSchema
} from '../data';

const KeySchema = Type.String({ description: 'A generic object key' });
const MovieYearSchema = Type.Integer({ minimum: 1878 });

const AwardsSchema = Type.Object({
  wins: NaturalNumberSchema,
  nominations: NaturalNumberSchema,
  text: StringSchema
});

const ImdbSchema = Type.Object({
  id: StringSchema,
  rating: FloatSchema,
  votes: NaturalNumberSchema
});

const TomatoesRatingSchema = Type.Object({
  meter: { ...NaturalNumberSchema, description: 'The rating meter in percent', examples: [42] },
  numReviews: { ...NaturalNumberSchema, description: 'The number of reviews', examples: [42] },
  rating: { ...FloatSchema, description: 'The rating', examples: [3.14] }
});

const TomatoesSchema = Type.Object({
  critic: Type.Partial(TomatoesRatingSchema),
  dvd: DateSchema,
  fresh: NaturalNumberSchema,
  lastUpdated: DateSchema,
  production: StringSchema,
  rotten: NaturalNumberSchema,
  viewer: Type.Partial(TomatoesRatingSchema),
  website: StringSchema
});

const MediaTypeSchema = Type.Enum(MediaTypes, {
  description: 'The type of media',
  examples: ['movie', 'series']
});

const MovieMandatoryFieldsSchema = Type.Object({
  title: { ...StringSchema, description: 'The title of the movie/series' },
  type: MediaTypeSchema,
  year: { ...MovieYearSchema, description: 'The year the movie/series was released' }
});

const MovieOptionalFieldsSchema = Type.Partial(
  Type.Object({
    awards: AwardsSchema,
    cast: {
      ...StringArraySchema,
      description: 'The cast of the movie/series',
      examples: [['Sigourney Weaver', 'Ashley Johnson']]
    },
    countries: {
      ...StringArraySchema,
      description: 'The countries where the movie/series was produced',
      examples: [['USA', 'UK']]
    },
    directors: {
      ...StringArraySchema,
      description: 'The directors of the movie/series',
      examples: [['Stanley Kubrick', 'John Spielberg']]
    },
    fullplot: {
      ...StringSchema,
      description: 'The full plot of the movie/series',
      examples: ['A long time ago...']
    },
    genres: {
      ...StringArraySchema,
      description: 'The genres of the movie/series',
      examples: [['Drama', 'Sci-Fi']]
    },
    imdb: Type.Partial(ImdbSchema),
    languages: {
      ...StringArraySchema,
      description: 'The languages spoken in the movie/series',
      examples: [['English', 'Latin', 'Swenglish']]
    },
    lastupdated: StringSchema,
    num_mflix_comments: NaturalNumberSchema,
    plot: {
      ...StringSchema,
      description: 'The plot of the movie/series',
      examples: ['A long time ago...']
    },
    poster: UriSchema,
    rated: StringSchema,
    released: DateSchema,
    runtime: {
      ...NaturalNumberSchema,
      description: 'The runtime of the movie/series in minutes',
      examples: [120]
    },
    tomatoes: Type.Partial(TomatoesSchema),
    writers: {
      ...StringArraySchema,
      description: 'The writers of the movie/series',
      examples: [['Neil Druckman']]
    }
  })
);

const IdSchema = Type.String({ description: 'The unique identifier of the resource' });
const MovieIdSchema = {
  ...IdSchema,
  description: 'The unique identifier of the movie',
  examples: ['573a1395f29313caabce1bd0']
};
const MovieCommentIdSchema = {
  ...IdSchema,
  description: 'The unique identifier of the movie comment'
};

const MovieSchema = Type.Object({
  ...MovieMandatoryFieldsSchema.properties,
  ...MovieOptionalFieldsSchema.properties
});

const PartialMovieSchema = Type.Partial(MovieSchema);

const MovieCommentInputSchema = Type.Object({
  text: StringSchema
});

const MovieCommentSchema = Type.Partial(
  Type.Object({
    name: {
      ...StringSchema,
      description: 'The name of the commenter',
      examples: ['The Commenter']
    },
    email: EmailSchema,
    movie_id: MovieIdSchema,
    date: DateSchema,
    ...MovieCommentInputSchema.properties
  })
);

const MovieCommentWithIdSchema = Type.Object({
  ...MovieCommentSchema.properties,
  ...{ _id: MovieCommentIdSchema }
});

type MovieSchemaType = Static<typeof MovieSchema>;
type MovieCommentSchemaType = Static<typeof MovieCommentSchema>;
type MovieCommentInputSchemaType = Static<typeof MovieCommentInputSchema>;

export {
  IdSchema,
  KeySchema,
  MovieCommentIdSchema,
  MovieCommentInputSchema,
  MovieCommentSchema,
  MovieCommentWithIdSchema,
  MovieIdSchema,
  MovieSchema,
  MovieYearSchema,
  PartialMovieSchema,
  type MovieCommentInputSchemaType,
  type MovieCommentSchemaType,
  type MovieSchemaType
};
