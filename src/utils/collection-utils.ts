import type { GenericFilterSchemaType } from '../schemas/movies/http';
import type { Sort, SortDirection } from 'mongodb';
import { type TObject, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { FastifyError } from 'fastify';
import { HttpStatusCodes } from './constants/enums';

const allowedSearchTypes = ['string', 'integer', 'float', 'number'];

const getInvalidPropertyKeyError = (key: string): FastifyError => {
  return {
    statusCode: HttpStatusCodes.BadRequest,
    message: `Invalid property key: ${key}`,
    name: 'Bad Request',
    code: 'ERR_BAD_REQUEST'
  } as const;
};

const getUnsupportedSearchTypeError = (key: string, valueType: string): FastifyError => {
  return {
    statusCode: HttpStatusCodes.BadRequest,
    message: `Unsupported search property: ${key} (type: ${valueType})`,
    name: 'Bad Request',
    code: 'ERR_BAD_REQUEST'
  } as const;
};

const getGenericSort = (filter: GenericFilterSchemaType, defaultSort: Sort): Sort => {
  const sort = filter.sort;

  if (sort !== undefined) {
    const sortParts = sort.split(',');
    return sortParts.reduce((acc, sortPart) => {
      const [key, order] = sortPart.split(':');
      const sortDirection: SortDirection = order.toLowerCase() === 'asc' ? 1 : -1;
      return { ...acc, [key]: sortDirection };
    }, {});
  }

  return defaultSort;
};

function getGenericSearch<T extends TObject>(
  schema: T,
  filter: GenericFilterSchemaType
): Record<string, string | RegExp | number> {
  const search = filter.search;

  if (search !== undefined) {
    const searchParts = search.split(',');
    return searchParts.reduce((acc, searchPart) => {
      const [key, stringifiedValue] = searchPart.split(':');
      const propertySchema = schema.properties[key];

      if (propertySchema === Type.Undefined()) {
        throw getInvalidPropertyKeyError(key);
      }
      const valueType: string = propertySchema.type as string;

      if (!allowedSearchTypes.includes(valueType)) {
        throw getUnsupportedSearchTypeError(key, valueType);
      }

      switch (valueType) {
        case 'string': {
          const stringValue: string = Value.Convert(Type.String(), stringifiedValue) as string;
          return { ...acc, [key]: new RegExp(stringValue, 'i') };
        }
        case 'integer':
        case 'float':
        case 'number': {
          const numericValue: number = Value.Convert(Type.Number(), stringifiedValue) as number;
          return { ...acc, [key]: numericValue };
        }
        default: {
          throw getUnsupportedSearchTypeError(key, valueType);
        }
      }
    }, {});
  }

  return {};
}

export { getGenericSort, getGenericSearch };
