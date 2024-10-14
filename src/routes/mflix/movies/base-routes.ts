import type { FastifyInstance, RouteOptions } from 'fastify';
import {
  CreateMovieSchema,
  type ListMoviesQuerySchemaType,
  ListMoviesSchema
} from '../../../schemas/movies/http';
import { HttpMethods, HttpStatusCodes } from '../../../utils/enums';
import { genOptionsRoute } from '../../../utils/routing-utils';
import type { MovieSchemaType } from '../../../schemas/movies/data';
import { RouteTags } from '../../../utils/constants';

const url = '';

const routes: RouteOptions[] = [
  {
    method: HttpMethods.GET,
    url,
    schema: ListMoviesSchema,
    handler: async function listMovies(request, reply) {
      const query = request.query as ListMoviesQuerySchemaType;
      const movies = await this.movieDataSource.listMovies(
        query.title ?? '',
        query.page,
        query.size
      );
      const totalCount: number = await this.movieDataSource.countMovies();
      const body = { movies, total: totalCount };
      reply.code(HttpStatusCodes.OK).send(body);
    }
  },
  {
    method: HttpMethods.POST,
    url,
    schema: CreateMovieSchema,
    handler: async function createMovie(request, reply) {
      const body = request.body as MovieSchemaType;
      const insertedId = await this.movieDataSource.createMovie(body);
      reply.code(HttpStatusCodes.Created).send({ id: insertedId });
    }
  }
];

const baseMovieRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(url, [RouteTags.movies], allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export default baseMovieRoutes;
