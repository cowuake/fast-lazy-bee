import type { FastifyMongoNestedObject, FastifyMongoObject } from '@fastify/mongodb';
import type { EnvSchemaType } from '../schemas/dotenv';
import type { MovieSchemaType, MovieWithIdSchemaType } from '../schemas/movies/data';
import type { MovieFilterSchemaType } from '../schemas/movies/http';

interface MovieDataStore {
  countMovies: (filter: MovieFilterSchemaType) => Promise<number>;
  listMovies: (filter: MovieFilterSchemaType) => Promise<MovieWithIdSchemaType[]>;
  createMovie: (movie: MovieSchemaType) => Promise<string>;
  fetchMovie: (id: string) => Promise<MovieWithIdSchemaType>;
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
