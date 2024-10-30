import type { FastifyMongoNestedObject, FastifyMongoObject } from '@fastify/mongodb';
import type { EnvSchemaType } from '../schemas/dotenv';
import type {
  MovieCommentSchemaType,
  MovieSchemaType,
  MovieWithIdSchemaType
} from '../schemas/movies/data';
import type { PaginatedSearchSchemaType } from '../schemas/movies/http';

interface DataStore {
  countMovies: (searchParams: PaginatedSearchSchemaType) => Promise<number>;
  countMovieComments: (movieId: string, searchParams: PaginatedSearchSchemaType) => Promise<number>;
  fetchMovies: (searchParams: PaginatedSearchSchemaType) => Promise<MovieWithIdSchemaType[]>;
  fetchMovieComments: (
    movieId: string,
    searchParams: PaginatedSearchSchemaType
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
    dataStore: DataStore;
  }
}
