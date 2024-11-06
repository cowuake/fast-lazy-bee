import type { FastifyInstance, RouteOptions } from 'fastify';
import type { HealthReportSchema, HealthReportSchemaType } from '../../schemas/diagnostics/data';
import { GetHealthSchema } from '../../schemas/diagnostics/http';
import { APIEndpoints } from '../../utils/constants/constants';
import {
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes,
  RouteTags
} from '../../utils/constants/enums';
import { addLinksToResource } from '../../utils/hal-utils';
import { acceptsHal, registerEndpointRoutes } from '../../utils/routing-utils';

const endpoint = APIEndpoints.Health;
const tags: RouteTags[] = [RouteTags.Diagnostics] as const;

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.GET, HttpMethods.HEAD],
    url: endpoint,
    schema: { ...GetHealthSchema, tags },
    handler: async (request, reply) => {
      const body: HealthReportSchemaType = { _id: '0', status: 'I am alive!' };

      if (acceptsHal(request)) {
        const halBody = addLinksToResource<typeof HealthReportSchema>(request, body);
        reply
          .code(HttpStatusCodes.OK)
          .header('Content-Type', HttpMediaTypes.HAL_JSON)
          .send(halBody);
      } else {
        reply.code(HttpStatusCodes.OK).send(body);
      }
    }
  } as const
] as const;

const diagnosticsRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, routes);
};

export default diagnosticsRoutes;
