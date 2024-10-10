import type { FastifyInstance, RouteOptions } from 'fastify';
import {
  ListMoviesResponseSchema,
  ListMoviesRequestSchema,
  CreateMovieRequestSchema,
  CreateMovieResponseSchema,
  type ListMoviesQuerySchemaType
} from '../../../schemas/movies/http';
import { HttpMethods, HttpStatusCodes } from '../../../utils/enums';
import { genOptionsRoute } from '../../../utils/routing-utils';
import type { MovieSchemaType } from '../../../schemas/movies/data';

const url = '';
const tags = ['Movies'];

const routes: RouteOptions[] = [
  {
    method: HttpMethods.GET,
    url,
    schema: {
      tags,
      querystring: ListMoviesRequestSchema.properties.querystring,
      response: {
        200: ListMoviesResponseSchema.properties.body
      }
    },
    handler: async function listMovies(request, reply) {
      const query = request.query as ListMoviesQuerySchemaType;
      const movies = await this.movieDataSource.listMovies(
        query.title ?? '',
        query.page,
        query.size
      );
      const totalCount: number = await this.movieDataSource.countMovies();
      const body = { movies, total: totalCount };
      reply.code(HttpStatusCodes.OK);
      return body;
    }
  },
  {
    method: HttpMethods.POST,
    url,
    schema: {
      tags,
      body: CreateMovieRequestSchema.properties.body,
      response: {
        201: CreateMovieResponseSchema.properties.body
      }
    },
    handler: async function createMovie(request, reply) {
      const body = request.body as MovieSchemaType;
      const insertedId = await this.movieDataSource.createMovie(body);
      reply.code(HttpStatusCodes.Created);
      return { id: insertedId };
    }
  }
];

module.exports = async function movieRoutes(fastify: FastifyInstance) {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');

  genOptionsRoute(fastify, url, tags, allowString);

  routes.forEach((route) => {
    fastify.route(route);
  });
};
