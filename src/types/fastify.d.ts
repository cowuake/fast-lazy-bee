import type { FastifyMongoNestedObject, FastifyMongoObject } from '@fastify/mongodb';
import type { EnvSchemaType } from '../schemas/dotenv';
import type {
  MovieListSchemaType,
  MovieSchemaType,
  MovieWithIdSchemaType
} from '../schemas/movies/data';

interface MovieDataSource {
  countMovies: () => Promise<number>;
  listMovies: (title: string, pageNumber: number, pageSize: number) => Promise<MovieListSchemaType>;
  createMovie: (movie: MovieSchemaType) => Promise<string>;
  fetchMovie: (id: string) => Promise<MovieWithIdSchemaType>;
  replaceMovie: (id: string, replacement: MovieSchemaType) => Promise<MovieSchemaType>;
  updateMovie: (id: string, update: MovieSchemaType) => Promise<MovieSchemaType>;
  deleteMovie: (id: string) => Promise<void>;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvSchemaType;
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
    movieDataSource: MovieDataSource;
  }
}
