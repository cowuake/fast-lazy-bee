import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { Collection, Db, Sort } from 'mongodb';
import type { UserSchemaType } from '../schemas/auth/data';
import {
  MovieCommentSchema,
  MovieSchema,
  type MovieCommentSchemaType,
  type MovieSchemaType
} from '../schemas/movies/data';
import type { PaginatedSearchSchemaType } from '../schemas/movies/http';
import { ResourceTypes } from '../utils/constants/enums';
import { getMongoFilter, getMongoSort } from '../utils/mongo-collection-utils';
import { genConflictError, genNotFoundError, genUnauthorizedError } from '../utils/routing-utils';

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
    const users: Collection<UserSchemaType> = db.collection('users');

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
      async checkUser(email, password) {
        const user = await users.findOne({ email, password });
        if (user === null) {
          throw genUnauthorizedError();
        }
        return user;
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
        const { title, year } = movie;
        const matchingMovie = await movies.findOne({ title, year });
        if (matchingMovie !== null) {
          throw genConflictError(ResourceTypes.Movie, {
            title: movie.title,
            year: movie.year.toString()
          });
        }
        const movieDoc = {
          ...movie,
          lastupdated: new Date().toISOString()
        };
        const { insertedId } = await movies.insertOne(movieDoc);
        return insertedId.toString();
      },
      async createMovieComment(comment) {
        const stringifiedId = comment.movie_id;
        const movieId = new fastify.mongo.ObjectId(stringifiedId);
        const movie = await movies.findOne({ _id: movieId });
        if (movie === null) {
          throw genNotFoundError(ResourceTypes.Movie, stringifiedId ?? 'the specified movie id');
        }
        await comments.insertOne({ ...comment, movie_id: movieId as unknown as string });
      },
      async registerUser(user) {
        const { email, password } = user as UserSchemaType;
        const existingUser = await users.findOne({ email, password });
        if (existingUser !== null) {
          throw genConflictError(ResourceTypes.User, { email });
        }
        await users.insertOne(user as UserSchemaType);
      },
      async fetchMovie(id) {
        const movie = await movies.findOne(
          { _id: new fastify.mongo.ObjectId(id) },
          { projection: { _id: 0 } }
        );
        if (movie === null) {
          throw genNotFoundError(ResourceTypes.Movie, id);
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
          throw genNotFoundError(ResourceTypes.Movie, id);
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
          throw genNotFoundError(ResourceTypes.Movie, id);
        }
      },
      async deleteMovie(id) {
        const deleted = await movies.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
        if (deleted.deletedCount === 0) {
          throw genNotFoundError(ResourceTypes.Movie, id);
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
