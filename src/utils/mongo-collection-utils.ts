import { type Static, type TArray, type TObject, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { FastifyError } from 'fastify';
import type { Filter, Sort, SortDirection } from 'mongodb';
import type { GenericFilterSchemaType } from '../schemas/movies/http';
import { HttpStatusCodes } from './constants/enums';

const allowedSearchTypes = ['string', 'integer', 'float', 'number', 'array'] as const;

const genInvalidPropertyKeyError = (key: string): FastifyError => {
  return {
    statusCode: HttpStatusCodes.BadRequest,
    message: `Invalid property key: ${key}`,
    name: 'Bad Request',
    code: 'ERR_BAD_REQUEST'
  } as const;
};

const genUnsupportedSearchTypeError = (key: string, valueType: string): FastifyError => {
  return {
    statusCode: HttpStatusCodes.BadRequest,
    message: `Unsupported search property: ${key} (type: ${valueType})`,
    name: 'Bad Request',
    code: 'ERR_BAD_REQUEST'
  } as const;
};

const getMongoSort = (filter: GenericFilterSchemaType, defaultSort: Sort): Sort => {
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

function getMongoFilter<T extends TObject>(
  schema: T,
  filter: GenericFilterSchemaType
): Filter<Static<typeof schema>> {
  const search = filter.search;

  if (search !== undefined) {
    const searchParts = search.split(',');
    return searchParts.reduce((acc, searchPart) => {
      const [key, stringifiedValue] = searchPart.split(':');
      const propertySchema = schema.properties[key];

      if (propertySchema === Type.Undefined()) {
        throw genInvalidPropertyKeyError(key);
      }
      const valueType: string = propertySchema.type as string;
      if (!allowedSearchTypes.some((type) => type === valueType)) {
        throw genUnsupportedSearchTypeError(key, valueType);
      }

      switch (valueType) {
        case 'string': {
          return { ...acc, [key]: new RegExp(stringifiedValue, 'i') };
        }
        case 'integer':
        case 'float':
        case 'number': {
          const numericValue = Value.Convert(Type.Number(), stringifiedValue) as number;
          return { ...acc, [key]: numericValue };
        }
        case 'array': {
          const arraySchema = propertySchema.items as TArray;
          const arrayValueType = arraySchema.type as string;

          if (arrayValueType === 'string') {
            const arrayValues = stringifiedValue.split('|');
            const conditions = arrayValues.map((value) => ({
              $elemMatch: { $regex: value, $options: 'i' }
            }));
            return { ...acc, [key]: { $all: conditions } };
          } else if (['integer', 'float', 'number'].includes(arrayValueType)) {
            const arrayValues = stringifiedValue
              .split('|')
              .map((value) => Value.Convert(Type.Number(), value)) as number[];
            return { ...acc, [key]: { $all: arrayValues } };
          }
          break;
        }
        default: {
          throw genUnsupportedSearchTypeError(key, valueType);
        }
      }
      return acc;
    }, {});
  }

  return {};
}

export { getMongoFilter, getMongoSort };
