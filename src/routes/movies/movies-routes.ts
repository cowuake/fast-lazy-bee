import type { FastifyInstance, RouteOptions } from 'fastify';
import type { MovieSchemaType } from '../../schemas/movies/data';
import {
  CreateMovieSchema,
  FetchMoviesSchema,
  type PaginatedSearchSchemaType
} from '../../schemas/movies/http';
import { RouteTags } from '../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../utils/constants/enums';
import { genOptionsRoute } from '../../utils/routing-utils';

const url = '';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url,
    schema: FetchMoviesSchema,
    handler: async function fetchMovies(request, reply) {
      const filter = request.query as PaginatedSearchSchemaType;
      const movies = await this.dataStore.fetchMovies(filter);
      const totalCount: number = await this.dataStore.countMovies(filter);
      const body = {
        data: movies,
        page: filter.page,
        pageSize: Math.min(movies.length, totalCount),
        totalCount
      };
      reply.code(HttpStatusCodes.OK).send(body);
    }
  },
  {
    method: HttpMethods.POST,
    url,
    schema: CreateMovieSchema,
    handler: async function createMovie(request, reply) {
      const body = request.body as MovieSchemaType;
      const insertedId = await this.dataStore.createMovie(body);
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