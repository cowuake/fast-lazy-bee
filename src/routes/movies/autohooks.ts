import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { MovieCommentSchemaType, MovieSchemaType } from '../../schemas/movies/data';
import type { Collection, Db, Sort } from 'mongodb';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { getGenericSearch, getGenericSort } from '../../utils/collection-utils';
import type {
  MovieFilterSchemaType,
  MovieCommentFilterSchemaType
} from '../../schemas/movies/http';

const notFoundError = (id: string): FastifyError => ({
  statusCode: HttpStatusCodes.NotFound,
  message: `Could not find movie with id ${id}`,
  name: 'Movie not found',
  code: 'ERR_NOT_FOUND'
});

const defaultMovieSort: Sort = { year: 1, title: 1 };
const defaultMovieCommentSort: Sort = { date: -1, name: 1 };

const getMovieSort = (filter: MovieFilterSchemaType): Sort =>
  getGenericSort(filter, defaultMovieSort);

const getMovieCommentSort = (filter: MovieCommentFilterSchemaType): Sort =>
  getGenericSort(filter, defaultMovieCommentSort);

const autoHooks = fp(
  async function movieAutoHooks(fastify: FastifyInstance) {
    const db: Db | undefined = fastify.mongo.db;
    if (db === undefined) {
      throw new Error('MongoDB database is not available');
    }
    const movies: Collection<MovieSchemaType> = db.collection('movies');
    const comments: Collection<MovieCommentSchemaType> = db.collection('comments');

    fastify.decorate('movieDataStore', {
      async countMovies(filter) {
        const search = getGenericSearch(filter);
        const totalCount = await movies.countDocuments(search);
        return totalCount;
      },
      async countMovieComments(movieId, filter) {
        const search = getGenericSearch(filter);
        const totalCount = await comments.countDocuments({
          ...search,
          movie_id: new fastify.mongo.ObjectId(movieId)
        });
        return totalCount;
      },
      async fetchMovies(filter) {
        const skip = (filter.page - 1) * filter.pageSize;
        const search = getGenericSearch(filter);
        const sort: Sort = getMovieSort(filter);
        const docs = await movies
          .find(search, { limit: filter.pageSize, skip })
          .sort(sort)
          .toArray();
        const output = docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
        return output;
      },
      async fetchMovieComments(movieId, filter) {
        const skip = (filter.page - 1) * filter.pageSize;
        const search = getGenericSearch(filter);
        const sort: Sort = getMovieCommentSort(filter);
        const docs = await comments
          .find(
            { ...search, movie_id: new fastify.mongo.ObjectId(movieId) },
            { limit: filter.pageSize, skip }
          )
          .sort(sort)
          .toArray();
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
      async fetchMovie(id) {
        const movie = await movies.findOne(
          { _id: new fastify.mongo.ObjectId(id) },
          { projection: { _id: 0 } }
        );
        if (movie === null) {
          throw notFoundError(id);
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
          throw notFoundError(id);
        }
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
          throw notFoundError(id);
        }
      },
      async deleteMovie(id) {
        const deleted = await movies.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
        if (deleted.deletedCount === 0) {
          throw notFoundError(id);
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
