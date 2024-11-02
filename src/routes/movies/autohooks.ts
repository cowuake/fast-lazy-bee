import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { Collection, Db, Sort } from 'mongodb';
import {
  MovieCommentSchema,
  MovieSchema,
  type MovieCommentSchemaType,
  type MovieSchemaType
} from '../../schemas/movies/data';
import type { PaginatedSearchSchemaType } from '../../schemas/movies/http';
import { HttpStatusCodes } from '../../utils/constants/enums';
import { getMongoFilter, getMongoSort } from '../../utils/mongo-collection-utils';

const genNotFoundError = (id: string): FastifyError => ({
  statusCode: HttpStatusCodes.NotFound,
  message: `Could not find movie with id ${id}`,
  name: 'Movie not found',
  code: 'ERR_NOT_FOUND'
});

const genMovieConflictError = (title: string, year: number): FastifyError => ({
  statusCode: HttpStatusCodes.Conflict,
  message: `Movie with title ${title} and year ${year} already exists`,
  name: 'Movie already exists',
  code: 'ERR_CONFLICT'
});

const defaultMovieSort: Sort = { year: 1, title: 1 };
const defaultMovieCommentSort: Sort = { date: -1, name: 1 };

const getMovieSort = (searchParams: PaginatedSearchSchemaType): Sort =>
  getMongoSort(searchParams, defaultMovieSort);

const getMovieCommentSort = (searchParams: PaginatedSearchSchemaType): Sort =>
  getMongoSort(searchParams, defaultMovieCommentSort);

const autoHooks = fp(
  async function movieAutoHooks(fastify: FastifyInstance) {
    const db: Db | undefined = fastify.mongo.db;
    if (db === undefined) {
      throw new Error('MongoDB database is not available');
    }
    const movies: Collection<MovieSchemaType> = db.collection('movies');
    const comments: Collection<MovieCommentSchemaType> = db.collection('comments');

    fastify.decorate('dataStore', {
      async countMovies(searchParams) {
        const condition = getMongoFilter(MovieSchema, searchParams);
        const totalCount = await movies.countDocuments(condition);
        return totalCount;
      },
      async countMovieComments(movieId, searchParams) {
        const condition = getMongoFilter(MovieCommentSchema, searchParams);
        condition['movie_id'] = new fastify.mongo.ObjectId(movieId) as unknown as string;
        const totalCount = await comments.countDocuments(condition);
        return totalCount;
      },
      async fetchMovies(searchParams) {
        const skip = (searchParams.page - 1) * searchParams.pageSize;
        const condition = getMongoFilter(MovieSchema, searchParams);
        const sort: Sort = getMovieSort(searchParams);
        const docs = await movies
          .find(condition, { limit: searchParams.pageSize, skip })
          .sort(sort)
          .toArray();
        const output = docs.map((doc) => ({ ...doc, _id: doc._id.toString() }));
        return output;
      },
      async fetchMovieComments(movieId, searchParams) {
        const skip = (searchParams.page - 1) * searchParams.pageSize;
        const condition = getMongoFilter(MovieCommentSchema, searchParams);
        const sort: Sort = getMovieCommentSort(searchParams);
        const docs = await comments
          .find(
            { ...condition, movie_id: new fastify.mongo.ObjectId(movieId) as unknown as string },
            { limit: searchParams.pageSize, skip }
          )
          .sort(sort)
          .toArray();
        const output = docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
        return output;
      },
      async createMovie(movie) {
        const matchingMovie = await movies.findOne({ title: movie.title, year: movie.year });
        if (matchingMovie !== null) {
          throw genMovieConflictError(movie.title, movie.year);
        }
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
          throw genNotFoundError(id);
        }
        const output = { ...movie, _id: id };
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
          throw genNotFoundError(id);
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
          throw genNotFoundError(id);
        }
      },
      async deleteMovie(id) {
        const deleted = await movies.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
        if (deleted.deletedCount === 0) {
          throw genNotFoundError(id);
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
