import type { FastifyInstance, RouteOptions } from 'fastify';
import type { EmptySchema } from '../schemas/data';
import { EntryPointSchema } from '../schemas/entrypoint-http';
import type { LinksSchemaType } from '../schemas/http';
import { API_ENDPOINTS } from '../utils/constants/constants';
import {
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes,
  IsolatedResourceTypes,
  ResourceCollections,
  RouteTags
} from '../utils/constants/enums';
import { addLinksToResource } from '../utils/hal-utils';
import { acceptsHal, registerEndpointRoutes } from '../utils/routing-utils';

const endpoint = API_ENDPOINTS.ENTRY_POINT;
const tags = [RouteTags.ENTRY_POINT] as const;

const route: RouteOptions = {
  method: [HttpMethods.GET, HttpMethods.HEAD],
  url: endpoint,
  schema: { ...EntryPointSchema, tags },
  handler: async function optionsRoute(request, reply) {
    const uri = request.url;
    const content = {};

    if (acceptsHal(request)) {
      const links: LinksSchemaType = {
        login: { href: `${uri}${IsolatedResourceTypes.LOGIN}` },
        health: { href: `${uri}${IsolatedResourceTypes.HEALTH}` },
        movies: { href: `${uri}${ResourceCollections.MOVIES}` },
        users: { href: `${uri}${ResourceCollections.USERS}` }
      };

      const halMovie = addLinksToResource<typeof EmptySchema>(request, content, links);
      reply.code(HttpStatusCodes.OK).header('Content-Type', HttpMediaTypes.HAL_JSON).send(halMovie);
    } else {
      reply.code(HttpStatusCodes.OK).send(content);
    }
  }
} as const;

const entryPoint = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, [route]);
};

export default entryPoint;
