import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { MovieSchemaType } from '../../../schemas/movies/data';
import type { Collection, Db } from 'mongodb';

module.exports = fp(
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
        const now = new Date();
        const movieDoc = {
          ...movie,
          lastupdated: now.toISOString()
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
          throw new Error('Movie not found');
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
          throw new Error('Movie not found');
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
          throw new Error('Movie not found');
        }
        return update;
      },
      async deleteMovie(id: string) {
        await movies.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
      }
    });
  },
  {
    encapsulate: true,
    dependencies: ['@fastify/mongodb'],
    name: 'movie-store'
  }
);
