import type { FastifyInstance, RouteOptions } from 'fastify';
import type { MovieSchema, MovieSchemaType } from '../../../schemas/movies/data';
import {
  type MovieIdObjectSchemaType,
  DeleteMovieSchema,
  FetchMovieSchema,
  ReplaceMovieSchema,
  UpdateMovieSchema
} from '../../../schemas/movies/http';
import {
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes,
  RouteTags
} from '../../../utils/constants/enums';
import { addLinksToResource } from '../../../utils/hal-utils';
import { acceptsHal, genOptionsRoute } from '../../../utils/routing-utils';

const url = '';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url,
    schema: FetchMovieSchema,
    handler: async function fetchMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const movie = await this.dataStore.fetchMovie(params.movie_id);

      if (acceptsHal(request)) {
        const halMovie = addLinksToResource<typeof MovieSchema>(request, movie);
        reply
          .code(HttpStatusCodes.OK)
          .header('Content-Type', HttpMediaTypes.HAL_JSON)
          .send(halMovie);
      } else {
        reply.code(HttpStatusCodes.OK).send(movie);
      }
    }
  },
  {
    method: HttpMethods.PUT,
    url,
    schema: ReplaceMovieSchema,
    handler: async function replaceMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const body = request.body as MovieSchemaType;
      await this.dataStore.replaceMovie(params.movie_id, body);
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
      await this.dataStore.updateMovie(params.movie_id, body);
      reply.code(HttpStatusCodes.NoContent);
    }
  },
  {
    method: HttpMethods.DELETE,
    url,
    schema: DeleteMovieSchema,
    handler: async function deleteMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      await this.dataStore.deleteMovie(params.movie_id);
      reply.code(HttpStatusCodes.NoContent);
    }
  }
];

const idMovieRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(url, [RouteTags.Movie], allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export default idMovieRoutes;
