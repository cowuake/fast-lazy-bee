import type { TObject } from '@sinclair/typebox';
import type { FastifyError, FastifyInstance, FastifyRequest, RouteOptions } from 'fastify';
import { EmptyStringSchema, StringSchema } from '../schemas/data';
import { ErrorSchema } from '../schemas/errors';
import {
  PaginatedCollectionSchema,
  PaginatedCollectionWithLinksSchema,
  ResourceWithLinksSchema
} from '../schemas/http';
import { HttpMediaTypes, HttpMethods, HttpStatusCodes, RouteTags } from './constants/enums';
import { HttpCodesToDescriptions } from './constants/records';

const createJsonResponseSchema = (
  statusCode: HttpStatusCodes,
  schema: TObject,
  collection = false
): Partial<Record<HttpStatusCodes, TObject>> => ({
  [statusCode]: {
    description: HttpCodesToDescriptions[statusCode],
    content: {
      [HttpMediaTypes.HAL_JSON]: {
        schema: collection
          ? PaginatedCollectionWithLinksSchema(schema)
          : ResourceWithLinksSchema(schema)
      },
      [HttpMediaTypes.JSON]: {
        schema: collection ? PaginatedCollectionSchema(schema) : schema
      }
    }
  }
});

const createTextResponseSchema = (
  statusCode: HttpStatusCodes
): Partial<Record<HttpStatusCodes, TObject>> => ({
  [statusCode]: {
    description: HttpCodesToDescriptions[statusCode],
    content: {
      [HttpMediaTypes.TEXT_PLAIN]: {
        schema: StringSchema
      }
    }
  }
});

const createEmptyResponseSchema = (
  statusCode: HttpStatusCodes
): Partial<Record<HttpStatusCodes, TObject>> => ({
  [statusCode]: {
    description: HttpCodesToDescriptions[statusCode],
    content: {
      [HttpMediaTypes.TEXT_PLAIN]: {
        schema: EmptyStringSchema
      }
    }
  }
});

const createErrorResponseSchemas = (
  statusCodes: HttpStatusCodes[]
): Partial<Record<HttpStatusCodes, TObject>> => ({
  ...statusCodes.reduce(
    (acc, statusCode) => ({
      ...acc,
      [statusCode]: {
        description: HttpCodesToDescriptions[statusCode],
        content: {
          [HttpMediaTypes.JSON]: {
            schema: ErrorSchema
          }
        }
      }
    }),
    {}
  )
});

const genOptionsRoute = (url: string, allowString: string): RouteOptions => ({
  method: HttpMethods.OPTIONS,
  url,
  schema: {
    summary: 'Get all allowed methods for the endpoint',
    tags: [RouteTags.OPTIONS],
    response: {
      ...createEmptyResponseSchema(HttpStatusCodes.NoContent)
    }
  },
  handler: async function options(_, reply) {
    reply.header('Allow', allowString).code(HttpStatusCodes.NoContent);
    reply.send(HttpStatusCodes.NoContent);
  }
});

const acceptsHal = (request: FastifyRequest): boolean => {
  return request.headers.accept?.includes(HttpMediaTypes.HAL_JSON) ?? false;
};

const genNotFoundError = (resourceType: string, id: string): FastifyError => ({
  statusCode: HttpStatusCodes.NotFound,
  message: `Could not find ${resourceType} corresponding to ${id}`,
  name: `Resource of type <${resourceType}> not found`,
  code: 'ERR_NOT_FOUND'
});

const genConflictError = (
  resourceType: string,
  fieldsAndValues: Record<string, string>
): FastifyError => ({
  statusCode: HttpStatusCodes.Conflict,
  message: `${resourceType} with ${JSON.stringify(fieldsAndValues)} already exists`,
  name: `${resourceType} already exists`,
  code: 'ERR_CONFLICT'
});

const genUnauthorizedError = (): FastifyError => ({
  statusCode: HttpStatusCodes.Unauthorized,
  message: 'Unauthorized',
  name: 'Unauthorized',
  code: 'ERR_UNAUTHORIZED'
});

const registerEndpointRoutes = async (
  fastify: FastifyInstance,
  endpoint: string,
  routes: RouteOptions[]
): Promise<void> => {
  const methods = routes.map((route) => route.method);
  const allowString = [HttpMethods.OPTIONS, ...methods].join(', ');
  const optionsRoute: RouteOptions = genOptionsRoute(endpoint, allowString);

  [optionsRoute, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export {
  acceptsHal,
  createEmptyResponseSchema,
  createErrorResponseSchemas,
  createJsonResponseSchema,
  createTextResponseSchema,
  genConflictError,
  genNotFoundError,
  genOptionsRoute,
  genUnauthorizedError,
  registerEndpointRoutes
};
