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
import { acceptsHal, registerEndpointRoutes } from '../../../utils/routing-utils';

const endpoint = '';
const tags: RouteTags[] = [RouteTags.Movie] as const;

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url: endpoint,
    schema: { ...FetchMovieSchema, tags: [...tags, RouteTags.Cache] },
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
  } as const,
  {
    method: HttpMethods.PUT,
    url: endpoint,
    schema: { ...ReplaceMovieSchema, tags },
    handler: async function replaceMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const body = request.body as MovieSchemaType;
      await this.dataStore.replaceMovie(params.movie_id, body);
      reply.code(HttpStatusCodes.NoContent);
    }
  } as const,
  {
    method: HttpMethods.PATCH,
    url: endpoint,
    schema: { ...UpdateMovieSchema, tags },
    handler: async function updateMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const body = request.body as MovieSchemaType;
      await this.dataStore.updateMovie(params.movie_id, body);
      reply.code(HttpStatusCodes.NoContent);
    }
  } as const,
  {
    method: HttpMethods.DELETE,
    url: endpoint,
    schema: { ...DeleteMovieSchema, tags },
    handler: async function deleteMovie(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      await this.dataStore.deleteMovie(params.movie_id);
      reply.code(HttpStatusCodes.NoContent);
    }
  }
];

const movieRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, routes);
};

export default movieRoutes;
