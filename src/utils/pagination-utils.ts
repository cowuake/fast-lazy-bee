const getPreviousPage = (page: number, pageSize: number): number | null =>
  page > 1 ? page - 1 : null;

const getNextPage = (page: number, pageSize: number, totalCount: number): number | null =>
  page * pageSize < totalCount ? page + 1 : null;

const getFirstPage = (): number => 1;

const getLastPage = (pageSize: number, totalCount: number): number =>
  pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;

export { getFirstPage, getLastPage, getNextPage, getPreviousPage };
