import type { FastifyMongoNestedObject, FastifyMongoObject } from '@fastify/mongodb';
import type { EnvSchemaType } from '../schemas/dotenv';
import type { MovieCommentSchemaType, MovieSchemaType } from '../schemas/movies/data';
import type { PaginatedSearchSchemaType, ResourceSchemaType } from '../schemas/movies/http';

interface DataStore {
  checkUser: (email: string, password: string) => Promise<ResourceSchemaType<UserSchemaType>>;
  registerUser: (user: UserSchemaType) => Promise<void>;
  countMovies: (searchParams: PaginatedSearchSchemaType) => Promise<number>;
  countMovieComments: (movieId: string, searchParams: PaginatedSearchSchemaType) => Promise<number>;
  fetchMovies: (searchParams: PaginatedSearchSchemaType) => Promise<MovieSchemaType[]>;
  fetchMovieComments: (
    movieId: string,
    searchParams: PaginatedSearchSchemaType
  ) => Promise<Array<ResourceSchemaType<MovieCommentSchemaType>>>;
  fetchMovie: (id: string) => Promise<ResourceSchemaType<MovieSchemaType>>;
  createMovie: (movie: MovieSchemaType) => Promise<string>;
  createMovieComment: (comment: MovieCommentSchemaType) => Promise<void>;
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
