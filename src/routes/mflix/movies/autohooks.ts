import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { MovieSchemaType } from '../../../schemas/movies/data';
import type { Collection, Db } from 'mongodb';
import { HttpStatusCodes } from '../../../utils/enums';

const autoHooks = fp(
  async function movieAutoHooks(fastify: FastifyInstance) {
    const db: Db | undefined = fastify.mongo.db;
    if (db === undefined) {
      throw new Error('MongoDB database is not available');
    }
    const movies: Collection<MovieSchemaType> = db.collection('movies');

    fastify.decorate('movieDataSource', {
      async countMovies() {
        const totalCount = await movies.countDocuments();
        return totalCount;
      },
      async listMovies(title, pageNumber, pageSize) {
        const skip = --pageNumber * pageSize;
        const filter = title !== '' ? { title: new RegExp(title, 'i') } : {};
        const docs = await movies.find(filter, { limit: pageSize, skip }).toArray();
        const output = docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
        return output;
      },
      async createMovie(movie) {
        const movieDoc = {
          ...movie,
          lastupdated: new Date().toISOString()
        };
        const { insertedId } = await movies.insertOne(movieDoc);
        return insertedId.toString();
      },
      async fetchMovie(id: string) {
        const movie = await movies.findOne(
          { _id: new fastify.mongo.ObjectId(id) },
          { projection: { _id: 0 } }
        );
        if (movie === null) {
          const error: FastifyError = {
            statusCode: HttpStatusCodes.NotFound,
            message: `Could not find movie with id ${id}`,
            name: 'Movie not found',
            code: 'ERR_NOT_FOUND'
          };
          throw error;
        }
        const output = { ...movie, id };
        return output;
      },
      async replaceMovie(id, replacement) {
        const updated = await movies.updateOne(
          { _id: new fastify.mongo.ObjectId(id) },
          {
            $set: {
              ...replacement,
              lastupdated: new Date().toDateString()
            }
          }
        );
        if (updated.modifiedCount === 0) {
          const error: FastifyError = {
            statusCode: HttpStatusCodes.NotFound,
            message: `Could not find movie with id ${id}`,
            name: 'Movie not found',
            code: 'ERR_NOT_FOUND'
          };
          throw error;
        }
        return replacement;
      },
      async updateMovie(id, update) {
        const updated = await movies.updateOne(
          { _id: new fastify.mongo.ObjectId(id) },
          {
            $set: {
              ...update,
              lastupdated: new Date().toDateString()
            }
          }
        );
        if (updated.matchedCount === 0) {
          const error: FastifyError = {
            statusCode: HttpStatusCodes.NotFound,
            message: `Could not find movie with id ${id}`,
            name: 'Movie not found',
            code: 'ERR_NOT_FOUND'
          };
          throw error;
        }
        return update;
      },
      async deleteMovie(id: string) {
        const deleted = await movies.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
        if (deleted.deletedCount === 0) {
          const error: FastifyError = {
            statusCode: HttpStatusCodes.NotFound,
            message: `Could not find movie with id ${id}`,
            name: 'Movie not found',
            code: 'ERR_NOT_FOUND'
          };
          throw error;
        }
      }
    });
  },
  {
    encapsulate: true,
    dependencies: ['@fastify/mongodb'],
    name: 'movie-store'
  }
);

export default autoHooks;
