import type { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import {
  CompleteMovieRequestBodySchema,
  MovieByIdParamsSchema,
  type MovieByIdParamsSchemaType,
  GetMovieResponseBodySchema,
  PartialMovieRequestBodySchema
} from '../../../schemas/movie';
import { HttpMethods, HttpStatusCodes } from '../../../utils/enums';
import { genOptionsRoute } from '../../../utils/routing-utils';

const url = '/:id';
const tags = ['Movies'];

const routes: Array<RouteOptions | any> = [
  {
    method: HttpMethods.GET,
    url,
    schema: {
      tags,
      params: MovieByIdParamsSchema,
      response: {
        200: GetMovieResponseBodySchema
      }
    },
    handler: async function fetchMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply: FastifyReply
    ) {
      const movie = await this.movieDataSource.fetchMovie(request.params.id);
      if (!movie) {
        reply.code(HttpStatusCodes.NotFound);
        return { error: 'Movie not found.' };
      }
      return movie;
    }
  },
  {
    method: HttpMethods.PUT,
    url,
    schema: {
      tags,
      params: MovieByIdParamsSchema,
      body: CompleteMovieRequestBodySchema
    },
    handler: async function updateMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply: FastifyReply
    ) {
      const res = await this.movieDataSource.replaceMovie(request.params.id, request.body);
      if (res.modifiedCount === 0) {
        reply.code(HttpStatusCodes.NotFound);
        return { error: 'Movie not found.' };
      }
      reply.code(HttpStatusCodes.NoContent);
    }
  },
  {
    method: HttpMethods.PATCH,
    url,
    schema: {
      tags,
      params: MovieByIdParamsSchema,
      body: PartialMovieRequestBodySchema
    },
    handler: async function updateMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply: FastifyReply
    ) {
      const res = await this.movieDataSource.updateMovie(request.params.id, request.body);
      if (res.modifiedCount === 0) {
        reply.code(HttpStatusCodes.NotFound);
        return { error: 'Movie not found.' };
      }
      reply.code(HttpStatusCodes.NoContent);
    }
  },
  {
    method: HttpMethods.DELETE,
    url,
    schema: {
      tags,
      params: MovieByIdParamsSchema
    },
    handler: async function deleteMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply: FastifyReply
    ) {
      const res = await this.movieDataSource.deleteMovie(request.params.id);
      if (res.deletedCount === 0) {
        reply.code(HttpStatusCodes.NotFound);
        return { error: 'Movie not found.' };
      }
      reply.code(HttpStatusCodes.NoContent);
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
