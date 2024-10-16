import type { FastifyInstance, RouteOptions } from 'fastify';
import {
  FetchMovieRequestSchema,
  FetchMovieResponseSchema,
  type MovieByIdParamsSchemaType,
  UpdateMovieRequestSchema,
  ReplaceMovieRequestSchema,
  DeleteMovieRequestSchema
} from '../../../schemas/movies/http';
import { HttpMethods, HttpStatusCodes } from '../../../utils/enums';
import { genOptionsRoute } from '../../../utils/routing-utils';
import type { MovieSchemaType } from '../../../schemas/movies/data';

const url = '/:id';
const tags = ['Movies'];

const routes: RouteOptions[] = [
  {
    method: HttpMethods.GET,
    url,
    schema: {
      tags: [...tags, 'Cache'],
      params: FetchMovieRequestSchema.properties.params,
      response: {
        [HttpStatusCodes.OK]: FetchMovieResponseSchema.properties.body
      }
    },
    handler: async function fetchMovie(request, reply) {
      const params = request.params as MovieByIdParamsSchemaType;
      const movie = await this.movieDataSource.fetchMovie(params.id);
      reply.code(HttpStatusCodes.OK).send(movie);
    }
  },
  {
    method: HttpMethods.PUT,
    url,
    schema: {
      tags,
      params: ReplaceMovieRequestSchema.properties.params,
      body: ReplaceMovieRequestSchema.properties.body
    },
    handler: async function updateMovie(request, reply) {
      const params = request.params as MovieByIdParamsSchemaType;
      const body = request.body as MovieSchemaType;
      await this.movieDataSource.replaceMovie(params.id, body);
      reply.code(HttpStatusCodes.NoContent);
    }
  },
  {
    method: HttpMethods.PATCH,
    url,
    schema: {
      tags,
      params: UpdateMovieRequestSchema.properties.params,
      body: UpdateMovieRequestSchema.properties.body
    },
    handler: async function updateMovie(request, reply) {
      const params = request.params as MovieByIdParamsSchemaType;
      const body = request.body as MovieSchemaType;
      await this.movieDataSource.updateMovie(params.id, body);
      reply.code(HttpStatusCodes.NoContent);
    }
  },
  {
    method: HttpMethods.DELETE,
    url,
    schema: {
      tags,
      params: DeleteMovieRequestSchema.properties.params
    },
    handler: async function deleteMovie(request, reply) {
      const params = request.params as MovieByIdParamsSchemaType;
      await this.movieDataSource.deleteMovie(params.id);
      reply.code(HttpStatusCodes.NoContent);
    }
  }
];

module.exports = async function movieRoutes(fastify: FastifyInstance) {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(url, tags, allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};
