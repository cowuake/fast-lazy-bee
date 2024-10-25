import type { FastifyInstance, RouteOptions } from 'fastify';
import {
  CreateMovieSchema,
  ListMoviesSchema,
  type MovieFilterSchemaType
} from '../../../../schemas/movies/http';
import { HttpMethods, HttpStatusCodes } from '../../../../utils/constants/enums';
import { genOptionsRoute } from '../../../../utils/routing-utils';
import type { MovieSchemaType } from '../../../../schemas/movies/data';
import { RouteTags } from '../../../../utils/constants/constants';

const url = '';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url,
    schema: ListMoviesSchema,
    handler: async function listMovies(request, reply) {
      const filter = request.query as MovieFilterSchemaType;
      const movies = await this.movieDataStore.listMovies(filter);
      const totalCount: number = await this.movieDataStore.countMovies(filter);
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
      const insertedId = await this.movieDataStore.createMovie(body);
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
