import { FastifyMongoObject } from '@fastify/mongodb';
import fastify from 'fastify';
import { EnvSchemaType } from '../schemas/dotenv';

interface FastifyMongoDataSource {
  countMovies(filter?: any): Promise<number>;
  listMovies(query): Promise<any[]>;
  createMovie(newMovie: any): Promise<string>;
  fetchMovie: (id: string, projection?: any) => Promise<any>;
  replaceMovie: (id: string, replacement: any) => Promise<any>;
  updateMovie: (id: string, update: any) => Promise<any>;
  deleteMovie: (id: string) => Promise<any>;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvSchemaType;
    mongo: FastifyMongoObject;
    mongoDataSource: FastifyMongoDataSource;
  }
  type AugmentedFastifyRequest = FastifyRequest<{
    Params: any;
    Querystring: any;
    Body: any;
  }>;
}
