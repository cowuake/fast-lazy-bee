import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { MovieSchemaType } from '../../../schemas/movies/data';
import type { Collection, Db, Sort, SortDirection } from 'mongodb';
import { HttpStatusCodes } from '../../../utils/constants/enums';
import type { MovieFilterSchemaType } from '../../../schemas/movies/http';

const notFoundError = (id: string): FastifyError => ({
  statusCode: HttpStatusCodes.NotFound,
  message: `Could not find movie with id ${id}`,
  name: 'Movie not found',
  code: 'ERR_NOT_FOUND'
});

const movieFiltertoMongoFilter = (
  filter: MovieFilterSchemaType
): Record<string, string | number | RegExp | undefined> => {
  const title = filter.title ?? '';
  const titleFilter = title !== '' ? { title: new RegExp(title, 'i') } : {};
  const yearFilter = filter.year !== undefined ? { year: filter.year } : {};
  return { ...titleFilter, ...yearFilter };
};

const defaultMovieSort = (filter: MovieFilterSchemaType): Sort => {
  return filter.year === undefined ? { title: 1 } : { year: 1, title: 1 };
};

const movieSort = (filter: MovieFilterSchemaType): Sort => {
  const sort = filter.sort;

  if (sort !== undefined) {
    const sortParts = sort.split(',');
    return sortParts.reduce((acc, sortPart) => {
      const [key, order] = sortPart.split(':');
      const sortDirection: SortDirection = order.toLowerCase() === 'asc' ? 1 : -1;
      return { ...acc, [key]: sortDirection };
    }, {});
  }

  return defaultMovieSort(filter);
};

const autoHooks = fp(
  async function movieAutoHooks(fastify: FastifyInstance) {
    const db: Db | undefined = fastify.mongo.db;
    if (db === undefined) {
      throw new Error('MongoDB database is not available');
    }
    const movies: Collection<MovieSchemaType> = db.collection('movies');

    fastify.decorate('movieDataSource', {
      async countMovies(filter) {
        const mongoFilter = movieFiltertoMongoFilter(filter);
        const totalCount = await movies.countDocuments(mongoFilter);
        return totalCount;
      },
      async listMovies(filter) {
        const skip = (filter.page - 1) * filter.pageSize;
        const mongoFilter = movieFiltertoMongoFilter(filter);
        const sort: Sort = movieSort(filter);
        const docs = await movies
          .find(mongoFilter, { limit: filter.pageSize, skip })
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
