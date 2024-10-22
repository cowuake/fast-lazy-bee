import type { FastifyInstance, RouteOptions } from 'fastify';
import {
  type MovieIdObjectSchemaType,
  FetchMovieSchema,
  ReplaceMovieSchema,
  UpdateMovieSchema,
  DeleteMovieSchema
} from '../../../schemas/movies/http';
import { HttpMethods, HttpStatusCodes } from '../../../utils/constants/enums';
import { genOptionsRoute } from '../../../utils/routing-utils';
import type { MovieSchemaType } from '../../../schemas/movies/data';
import { RouteTags } from '../../../utils/constants/constants';

const url = '/:id';

const routes: RouteOptions[] = [
  {
    method: HttpMethods.GET,
    url,
    schema: FetchMovieSchema,
    handler: async function fetchMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const movie = await this.movieDataSource.fetchMovie(params.id);
      reply.code(HttpStatusCodes.OK).send(movie);
    }
  },
  {
    method: HttpMethods.PUT,
    url,
    schema: ReplaceMovieSchema,
    handler: async function updateMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const body = request.body as MovieSchemaType;
      await this.movieDataSource.replaceMovie(params.id, body);
      reply.code(HttpStatusCodes.NoContent);
    }
  },
  {
    method: HttpMethods.PATCH,
    url,
    schema: UpdateMovieSchema,
    handler: async function updateMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const body = request.body as MovieSchemaType;
      await this.movieDataSource.updateMovie(params.id, body);
      reply.code(HttpStatusCodes.NoContent);
    }
  },
  {
    method: HttpMethods.DELETE,
    url,
    schema: DeleteMovieSchema,
    handler: async function deleteMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      await this.movieDataSource.deleteMovie(params.id);
      reply.code(HttpStatusCodes.NoContent);
    }
  }
];

const idMovieRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(url, [RouteTags.movies], allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export default idMovieRoutes;
