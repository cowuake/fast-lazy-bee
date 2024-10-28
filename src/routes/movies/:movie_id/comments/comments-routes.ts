import type { FastifyInstance, RouteOptions } from 'fastify';
import {
  FetchMovieCommentsSchema,
  type MovieCommentFilterSchemaType,
  type MovieIdObjectSchemaType
} from '../../../../schemas/movies/http';
import { RouteTags } from '../../../../utils/constants/constants';
import { HttpMethods, HttpStatusCodes } from '../../../../utils/constants/enums';
import { genOptionsRoute } from '../../../../utils/routing-utils';

const url = '';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url,
    schema: FetchMovieCommentsSchema,
    handler: async function fetchMovieComments(request, reply) {
      const params = request.params as MovieIdObjectSchemaType;
      const movieId = params.movie_id;
      const filter = request.query as MovieCommentFilterSchemaType;
      const comments = await this.movieDataStore.fetchMovieComments(movieId, filter);
      const totalCount: number = await this.movieDataStore.countMovieComments(movieId, filter);
      const body = {
        data: comments,
        page: filter.page,
        pageSize: Math.min(comments.length, totalCount),
        totalCount
      };
      reply.code(HttpStatusCodes.OK).send(body);
    }
  }
];

const movieCommentCollectionRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(url, [RouteTags.comments], allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export default movieCommentCollectionRoutes;
