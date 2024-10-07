import type { FastifyInstance, FastifyRequest, RouteOptions } from 'fastify';
import {
  CompleteMovieRequestBodySchema,
  CreateMovieResponseBodySchema,
  GetMoviesQuerySchema,
  type MovieListSchemaType,
  MovieListResponseSchema,
  type MovieListResponseSchemaType
} from '../../../schemas/movie';
import { HttpMethods, HttpStatusCodes } from '../../../utils/enums';
import { genOptionsRoute } from '../../../utils/routing-utils';

const url = '';
const tags = ['Movies'];

const routes: RouteOptions[] = [
  {
    method: HttpMethods.GET,
    url,
    schema: {
      tags,
      querystring: GetMoviesQuerySchema,
      response: {
        200: MovieListResponseSchema
      }
    },
    handler: async function listMovies(request: FastifyRequest, _) {
      const movies: MovieListSchemaType = await this.movieDataSource.listMovies(request.query);
      const totalCount: number = await this.movieDataSource.countMovies();
      const body: MovieListResponseSchemaType = { movies, total: totalCount };
      return body;
    }
  },
  {
    method: HttpMethods.POST,
    url,
    schema: {
      tags,
      body: CompleteMovieRequestBodySchema,
      response: {
        201: CreateMovieResponseBodySchema
      }
    },
    handler: async function createMovie(request, reply) {
      const insertedId = await this.movieDataSource.createMovie(request.body);
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
