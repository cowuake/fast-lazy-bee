import type { FastifyInstance, RouteOptions } from 'fastify';
import type { MovieSchema, MovieSchemaType } from '../../schemas/movies/data';
import {
  CreateMovieSchema,
  FetchMoviesSchema,
  type PaginatedSearchSchemaType
} from '../../schemas/movies/http';
import { getExpirationDate } from '../../utils/cache-utils';
import {
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes,
  RouteTags
} from '../../utils/constants/enums';
import { addLinksToCollection } from '../../utils/hal-utils';
import { acceptsHal, genOptionsRoute } from '../../utils/routing-utils';

const url = '';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url,
    schema: FetchMoviesSchema,
    handler: async function fetchMovies(request, reply) {
      const filter = request.query as PaginatedSearchSchemaType;
      const movies = await this.dataStore.fetchMovies(filter);
      const totalCount: number = await this.dataStore.countMovies(filter);
      const page = filter.page;
      const pageSize = Math.min(movies.length, totalCount);
      const body = {
        data: movies,
        page,
        pageSize,
        totalCount
      };

      if (acceptsHal(request)) {
        const resourceLinks = {
          comments: { href: '{collection}/{resource}/comments' }
        };
        const halBody = addLinksToCollection<typeof MovieSchema>(request, body, {}, resourceLinks);
        reply
          .code(HttpStatusCodes.OK)
          .header('Content-Type', HttpMediaTypes.HAL_JSON)
          .send(halBody);
      } else {
        reply.code(HttpStatusCodes.OK).expires(getExpirationDate()).send(body);
      }
    }
  },
  {
    method: HttpMethods.POST,
    url,
    schema: CreateMovieSchema,
    handler: async function createMovie(request, reply) {
      const body = request.body as MovieSchemaType;
      const insertedId = await this.dataStore.createMovie(body);
      reply
        .headers({ location: insertedId })
        .code(HttpStatusCodes.Created)
        .send({ _id: insertedId });
    }
  }
];

const baseMovieRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(url, [RouteTags.Movies], allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export default baseMovieRoutes;
