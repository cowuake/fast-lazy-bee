import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Collection } from 'mongodb';
import {
  CreateMovieBodySchemaType,
  ReplaceMovieBodySchemaType,
  UpdateMovieBodySchemaType,
  GetMoviesQuerySchemaType,
  MovieSchemaType
} from '../../../schemas/movie';

module.exports = fp(
  async function movieAutoHooks(fastify: FastifyInstance) {
    const movies = fastify.mongo.db?.collection('movies') as Collection<MovieSchemaType>;
    // fastify.register(MovieSchemaType);

    fastify.decorate('mongoDataSource', {
      async countMovies(filter = {}) {
        const totalCount = await movies.countDocuments(filter);
        return totalCount;
      },
      async listMovies(query: GetMoviesQuerySchemaType) {
        const skip = (query.page - 1) * query.size;
        const filter = query.title ? { title: new RegExp(query.title, 'i') } : {};
        const docs = await movies.find(filter, { limit: query.size, skip }).toArray();
        return docs;
      },
      async createMovie(newMovie: CreateMovieBodySchemaType) {
        const now = new Date();
        const newMovieDoc: CreateMovieBodySchemaType = {
          ...newMovie,
          lastupdated: now.toISOString()
        };
        const { insertedId } = await movies.insertOne(newMovieDoc);
        return insertedId.toString();
      },
      async fetchMovie(id: string, projection = {}) {
        const movie = await movies.findOne(
          { _id: new fastify.mongo.ObjectId(id) },
          { projection: { ...projection, _id: 0 } }
        );
        return movie;
      },
      async replaceMovie(id: string, replacement: ReplaceMovieBodySchemaType) {
        return movies.updateOne(
          { _id: new fastify.mongo.ObjectId(id) },
          {
            $set: {
              ...replacement,
              lastupdated: new Date().toDateString()
            }
          }
        );
      },
      async updateMovie(id: string, update: UpdateMovieBodySchemaType) {
        return movies.updateOne(
          { _id: new fastify.mongo.ObjectId(id) },
          {
            $set: {
              ...update,
              lastupdated: new Date().toDateString()
            }
          }
        );
      },
      async deleteMovie(id: string) {
        return movies.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
      }
    });
  },
  {
    encapsulate: true,
    dependencies: ['@fastify/mongodb'],
    name: 'movie-store'
  }
);
