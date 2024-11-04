import type { FastifyInstance, RouteOptions } from 'fastify';
import type { EmptySchema } from '../schemas/data';
import { EntryPointSchema } from '../schemas/entrypoint-http';
import type { LinksSchemaType } from '../schemas/http';
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

const endpoint = '/';
// const getCollectionLinks = (uri: string): LinksSchemaType =>
//   Object.values(ResourceCollections).reduce((acc, collectionName) => {
//     const link: LinksSchemaType = { [collectionName]: { href: `${uri}${collectionName}` } };
//     return { ...acc, ...link };
//   }, {});

const tags = [RouteTags.EntryPoint] as const;

const route: RouteOptions = {
  method: [HttpMethods.GET, HttpMethods.HEAD],
  url: endpoint,
  schema: { ...EntryPointSchema, tags },
  handler: async function optionsRoute(request, reply) {
    const uri = request.url;
    const content = {};

    if (acceptsHal(request)) {
      const links: LinksSchemaType = {
        login: { href: `${uri}${IsolatedResourceTypes.Login}` },
        health: { href: `${uri}${IsolatedResourceTypes.Health}` },
        movies: { href: `${uri}${ResourceCollections.Movies}` },
        users: { href: `${uri}${ResourceCollections.Users}` }
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
