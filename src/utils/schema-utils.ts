import type { TObject } from '@sinclair/typebox';
import {
  PaginatedCollectionSchema,
  PaginatedCollectionWithLinksSchema,
  ResourceWithLinksSchema
} from '../schemas/http';
import { HttpMediaTypes, type HttpStatusCodes } from './constants/enums';
import { HttpCodesToDescriptions } from './constants/records';

const createResponseSchema = <T extends TObject>(
  statusCode: HttpStatusCodes,
  schema: TObject,
  collection = false
): Partial<Record<HttpStatusCodes, T>> => {
  const result = {
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
  };

  return result;
};

export { createResponseSchema };
