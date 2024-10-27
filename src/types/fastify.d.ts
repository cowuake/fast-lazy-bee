import type { FastifyMongoNestedObject, FastifyMongoObject } from '@fastify/mongodb';
import type { EnvSchemaType } from '../schemas/dotenv';
import type {
  MovieCommentSchemaType,
  MovieSchemaType,
  MovieWithIdSchemaType
} from '../schemas/movies/data';
import type { MovieCommentFilterSchemaType, MovieFilterSchemaType } from '../schemas/movies/http';

interface MovieDataStore {
  countMovies: (filter: MovieFilterSchemaType) => Promise<number>;
  countMovieComments: (movieId: string, filter: MovieCommentFilterSchemaType) => Promise<number>;
  fetchMovies: (filter: MovieFilterSchemaType) => Promise<MovieWithIdSchemaType[]>;
  fetchMovieComments: (
    movieId: string,
    filter: MovieCommentFilterSchemaType
  ) => Promise<MovieCommentSchemaType[]>;
  fetchMovie: (id: string) => Promise<MovieWithIdSchemaType>;
  createMovie: (movie: MovieSchemaType) => Promise<string>;
  replaceMovie: (id: string, replacement: MovieSchemaType) => Promise<void>;
  updateMovie: (id: string, update: MovieSchemaType) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvSchemaType;
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
    movieDataStore: MovieDataStore;
  }
}
