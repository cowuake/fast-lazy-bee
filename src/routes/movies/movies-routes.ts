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
import { acceptsHal, registerEndpointRoutes } from '../../utils/routing-utils';

const endpoint = '';
const tags: RouteTags[] = [RouteTags.Movies] as const;

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url: endpoint,
    schema: { ...FetchMoviesSchema, tags: [...tags, RouteTags.Cache] },
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
  } as const,
  {
    method: HttpMethods.POST,
    url: endpoint,
    schema: { ...CreateMovieSchema, tags },
    handler: async function createMovie(request, reply) {
      const body = request.body as MovieSchemaType;
      const insertedId = await this.dataStore.createMovie(body);
      reply
        .headers({ location: insertedId })
        .code(HttpStatusCodes.Created)
        .send({ _id: insertedId });
    }
  } as const
];

const moviesRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, routes);
};

export default moviesRoutes;
