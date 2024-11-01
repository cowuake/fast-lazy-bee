import type { FastifyInstance, RouteOptions } from 'fastify';
import type { MovieCommentSchema } from '../../../../schemas/movies/data';
import {
  FetchMovieCommentsSchema,
  type MovieIdObjectSchemaType,
  type PaginatedSearchSchemaType
} from '../../../../schemas/movies/http';
import { RouteTags } from '../../../../utils/constants/constants';
import { HttpMediaTypes, HttpMethods, HttpStatusCodes } from '../../../../utils/constants/enums';
import { addLinksToCollection } from '../../../../utils/hal-utils';
import { acceptsHal, genOptionsRoute } from '../../../../utils/routing-utils';

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
