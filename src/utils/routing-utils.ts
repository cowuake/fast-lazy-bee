import type { TObject } from '@sinclair/typebox';
import type { FastifyError, FastifyRequest, RouteOptions } from 'fastify';
import { ErrorSchema } from '../schemas/errors';
import {
  PaginatedCollectionSchema,
  PaginatedCollectionWithLinksSchema,
  ResourceWithLinksSchema
} from '../schemas/http';
import { HttpMediaTypes, HttpMethods, HttpStatusCodes } from './constants/enums';
import { HttpCodesToDescriptions } from './constants/records';

const createResponseSchema = (
  statusCode: HttpStatusCodes,
  schema: TObject,
  collection = false
): Partial<Record<HttpStatusCodes, TObject>> => ({
  [statusCode]: {
    description: HttpCodesToDescriptions[statusCode],
    content: {
      [HttpMediaTypes.JSON]: {
        schema: collection ? PaginatedCollectionSchema(schema) : schema
      },
      [HttpMediaTypes.HAL_JSON]: {
        schema: collection
          ? PaginatedCollectionWithLinksSchema(schema)
          : ResourceWithLinksSchema(schema)
      }
    }
  }
});

const createEmptyResponseSchema = (
  statusCode: HttpStatusCodes
): Partial<Record<HttpStatusCodes, TObject>> => ({
  [statusCode]: {
    description: HttpCodesToDescriptions[statusCode],
    content: null
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

const genOptionsRoute = (url: string, tags: string[], allowString: string): RouteOptions => {
  return {
    method: HttpMethods.OPTIONS,
    url,
    schema: {
      tags,
      response: {
        ...createEmptyResponseSchema(HttpStatusCodes.NoContent)
      }
    },
    handler: async function options(_, reply) {
      reply.header('Allow', allowString).code(HttpStatusCodes.NoContent);
      reply.send(HttpStatusCodes.NoContent);
    }
  };
};

const acceptsHal = (request: FastifyRequest): boolean => {
  return request.headers.accept?.includes(HttpMediaTypes.HAL_JSON) ?? false;
};

const genNotFoundError = (resourceType: string, id: string): FastifyError => ({
  statusCode: HttpStatusCodes.NotFound,
  message: `Could not find ${resourceType} corresponding to ${id}`,
  name: `${resourceType} not found`,
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

export {
  acceptsHal,
  createEmptyResponseSchema,
  createErrorResponseSchemas,
  createResponseSchema,
  genConflictError,
  genNotFoundError,
  genOptionsRoute,
  genUnauthorizedError
};
