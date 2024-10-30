import { type Static, type TArray, type TObject, type TSchema, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { FastifyError } from 'fastify';
import type { Filter, Sort, SortDirection } from 'mongodb';
import type { CollectionSearchSchemaType } from '../schemas/movies/http';
import { HttpStatusCodes } from './constants/enums';

const allowedSearchNumericTypes = ['integer', 'float', 'number'] as const;
const allowedSearchTypes = [...allowedSearchNumericTypes, 'string', 'array', 'Date'] as const;

const validatePropertyKey = (key: string, schema: TSchema): void => {
  if (schema !== Type.Undefined()) {
    return;
  }
  const error: FastifyError = {
    statusCode: HttpStatusCodes.BadRequest,
    message: `Invalid property key: ${key}`,
    name: 'Bad Request',
    code: 'ERR_BAD_REQUEST'
  } as const;

  throw error;
};

const validateSearchType = (key: string, valueType: string): void => {
  if (allowedSearchTypes.some((type) => type === valueType)) {
    return;
  }
  const error: FastifyError = {
    statusCode: HttpStatusCodes.BadRequest,
    message: `Unsupported search property: ${key} (type: ${valueType})`,
    name: 'Bad Request',
    code: 'ERR_BAD_REQUEST'
  } as const;

  throw error;
};

const getMongoSort = (filter: CollectionSearchSchemaType, defaultSort: Sort): Sort => {
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
  filter: CollectionSearchSchemaType
): Filter<Static<typeof schema>> {
  const search = filter.filter;

  if (search !== undefined) {
    const searchParts = search.split(',');
    return searchParts.reduce((acc, searchPart) => {
      const [key, stringifiedValue] = searchPart.split(':');

      const propertySchema = schema.properties[key];
      validatePropertyKey(key, propertySchema);

      const valueType: string = propertySchema.type as string;
      validateSearchType(key, valueType);

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
        case 'Date': {
          const dateValue = Value.Convert(Type.Date(), stringifiedValue) as Date;
          return { ...acc, [key]: dateValue };
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
          break;
        }
      }
      return acc;
    }, {});
  }

  return {};
}

export { getMongoFilter, getMongoSort };
