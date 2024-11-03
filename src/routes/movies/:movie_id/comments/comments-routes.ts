import type { FastifyInstance, RouteOptions } from 'fastify';
import type { UserSchemaType } from '../../../../schemas/auth/data';
import type {
  MovieCommentInputSchemaType,
  MovieCommentSchema
} from '../../../../schemas/movies/data';
import {
  CreateMovieCommentSchema,
  FetchMovieCommentsSchema,
  type MovieIdObjectSchemaType,
  type PaginatedSearchSchemaType
} from '../../../../schemas/movies/http';
import {
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes,
  RouteTags
} from '../../../../utils/constants/enums';
import { addLinksToCollection } from '../../../../utils/hal-utils';
import { acceptsHal, genOptionsRoute, genUnauthorizedError } from '../../../../utils/routing-utils';

const url = '';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url,
    schema: FetchMovieCommentsSchema,
    handler: async function fetchMovieComments(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const movieId = params.movie_id;
      const filter = request.query as PaginatedSearchSchemaType;
      const comments = await this.dataStore.fetchMovieComments(movieId, filter);
      const totalCount: number = await this.dataStore.countMovieComments(movieId, filter);
      const body = {
        data: comments,
        page: filter.page,
        pageSize: Math.min(comments.length, totalCount),
        totalCount
      };

      if (acceptsHal(request)) {
        const halBody = addLinksToCollection<typeof MovieCommentSchema>(request, body);
        reply
          .code(HttpStatusCodes.OK)
          .header('Content-Type', HttpMediaTypes.HAL_JSON)
          .send(halBody);
      } else {
        reply.code(HttpStatusCodes.OK).send(body);
      }
    }
  },
  {
    method: HttpMethods.POST,
    url,
    schema: CreateMovieCommentSchema,
    handler: async function createMovieComment(request, reply) {
      const token = request.headers.authorization?.split('Bearer ')[1];
      if (token === undefined) {
        throw genUnauthorizedError();
      }

      const { name, email } = this.jwt.decode(token) as UserSchemaType;
      const movieCommentInput = request.body as MovieCommentInputSchemaType;
      const params = request.params as MovieIdObjectSchemaType;
      const movieId = params.movie_id;
      const movieComment = {
        ...movieCommentInput,
        name,
        email,
        movie_id: movieId,
        date: new Date().toISOString()
      };

      await this.dataStore.createMovieComment(movieComment);
      reply.code(HttpStatusCodes.Created);
    }
  }
];

const movieCommentCollectionRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(url, [RouteTags.Comments], allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export default movieCommentCollectionRoutes;
