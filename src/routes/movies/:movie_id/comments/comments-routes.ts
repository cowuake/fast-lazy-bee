import type { FastifyInstance, RouteOptions } from 'fastify';
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
import type { UserSchemaType } from '../../../../schemas/users/data';
import {
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes,
  RouteTags
} from '../../../../utils/constants/enums';
import { addLinksToCollection } from '../../../../utils/hal-utils';
import {
  acceptsHal,
  genUnauthorizedError,
  registerEndpointRoutes
} from '../../../../utils/routing-utils';

const endpoint = '';
const tags: RouteTags[] = [RouteTags.Comments] as const;

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url: endpoint,
    schema: { ...FetchMovieCommentsSchema, tags: [...tags, RouteTags.Cache] },
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
  } as const,
  {
    method: HttpMethods.POST,
    url: endpoint,
    schema: { ...CreateMovieCommentSchema, tags },
    handler: async function createMovieComment(request, reply) {
      const token = request.headers.authorization?.split('Bearer ')[1];

      if (token === undefined) {
        throw genUnauthorizedError();
      }

      const decodedToken = this.jwt.decode(token) as unknown as UserSchemaType;
      const { name, email } = decodedToken;
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
  } as const
] as const;

const movieCommentsRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, routes);
};

export default movieCommentsRoutes;
