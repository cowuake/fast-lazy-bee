import type { GenericFilterSchemaType } from '../schemas/movies/http';
import type { Sort, SortDirection } from 'mongodb';

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

const getGenericSearch = (filter: GenericFilterSchemaType): Record<string, RegExp> => {
  const search = filter.search;

  if (search !== undefined) {
    const searchParts = search.split(',');
    return searchParts.reduce((acc, searchPart) => {
      const [key, value] = searchPart.split(':');
      return { ...acc, [key]: new RegExp(value, 'i') };
    }, {});
  }

  return {};
};

export { getGenericSort, getGenericSearch };
