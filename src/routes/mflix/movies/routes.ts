import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  CompleteMovieRequestBodySchema,
  CreateMovieResponseBodySchema,
  MovieByIdParamsSchema,
  GetMoviesQuerySchema,
  MovieListResponseSchema,
  MovieListResponseSchemaType,
  MovieByIdParamsSchemaType,
  GetMovieResponseBodySchema,
  PartialMovieRequestBodySchema
} from '../../../schemas/movie';
import { HttpMethods } from '../../../utils/enums';

const tags = ['Movies'];

module.exports = async function movieRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: 'OPTIONS',
    url: '',
    schema: {
      tags: tags
    },
    handler: async function options(request, reply) {
      reply.header('Allow', 'OPTIONS, GET, POST').code(204);
    }
  });

  fastify.route({
    method: HttpMethods.OPTIONS,
    url: '/:id',
    schema: {
      tags: tags
    },
    handler: async function options(request, reply) {
      reply.header('Allow', 'OPTIONS, GET, POST, PUT, PATCH, DELETE').code(204);
    }
  });

  fastify.route({
    method: HttpMethods.GET,
    url: '',
    schema: {
      tags: tags,
      querystring: GetMoviesQuerySchema,
      response: {
        200: MovieListResponseSchema
      }
    },
    handler: async function listMovies(request: FastifyRequest, reply) {
      const movies = await this.mongoDataSource.listMovies(request.query);
      const totalCount = await this.mongoDataSource.countMovies();
      const body: MovieListResponseSchemaType = { movies, total: totalCount };
      return body;
    }
  });

  fastify.route({
    method: HttpMethods.POST,
    url: '',
    schema: {
      tags: tags,
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
  });

  fastify.route({
    method: HttpMethods.GET,
    url: '/:id',
    schema: {
      tags: tags,
      params: MovieByIdParamsSchema,
      response: {
        200: GetMovieResponseBodySchema
      }
    },
    handler: async function fetchMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply
    ) {
      const movie = await this.mongoDataSource.fetchMovie(request.params.id);
      if (!movie) {
        reply.code(404);
        return { error: 'Movie not found.' };
      }
      return movie;
    }
  });

  fastify.route({
    method: HttpMethods.PUT,
    url: '/:id',
    schema: {
      tags: tags,
      params: MovieByIdParamsSchema,
      body: CompleteMovieRequestBodySchema
    },
    handler: async function updateMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply
    ) {
      const res = await this.mongoDataSource.replaceMovie(request.params.id, request.body);
      if (res.modifiedCount === 0) {
        reply.code(404);
        return { error: 'Movie not found.' };
      }
      reply.code(204);
    }
  });

  fastify.route({
    method: HttpMethods.PATCH,
    url: '/:id',
    schema: {
      tags: tags,
      params: MovieByIdParamsSchema,
      body: PartialMovieRequestBodySchema
    },
    handler: async function updateMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply
    ) {
      const res = await this.mongoDataSource.updateMovie(request.params.id, request.body);
      if (res.modifiedCount === 0) {
        reply.code(404);
        return { error: 'Movie not found.' };
      }
      reply.code(204);
    }
  });

  fastify.route({
    method: HttpMethods.DELETE,
    url: '/:id',
    schema: {
      tags: tags,
      params: MovieByIdParamsSchema
    },
    handler: async function deleteMovie(
      request: FastifyRequest<{ Params: MovieByIdParamsSchemaType }>,
      reply
    ) {
      const res = await this.mongoDataSource.deleteMovie(request.params.id);
      if (res.deletedCount === 0) {
        reply.code(404);
        return { error: 'Movie not found.' };
      }
      reply.code(204);
    }
  });
};
