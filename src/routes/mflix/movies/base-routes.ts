import { FastifyInstance, FastifyRequest, RouteOptions } from 'fastify';
import {
  CompleteMovieRequestBodySchema,
  CreateMovieResponseBodySchema,
  GetMoviesQuerySchema,
  MovieListResponseSchema,
  MovieListResponseSchemaType
} from '../../../schemas/movie';
import { HttpMethods } from '../../../utils/enums';
import { genOptionsRoute } from '../../../utils/routing-utils';

const url = '';
const tags = ['Movies'];

const routes: Array<RouteOptions> = [
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
      const movies = await this.mongoDataSource.listMovies(request.query);
      const totalCount = await this.mongoDataSource.countMovies();
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
      const insertedId = await this.mongoDataSource.createMovie(request.body);
      reply.code(201);
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
