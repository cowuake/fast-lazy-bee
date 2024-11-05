import type { TObject } from '@sinclair/typebox';
import type { FastifyRequest } from 'fastify';
import type {
  LinksSchemaType,
  PaginatedCollectionSchemaType,
  PaginatedCollectionWithLinksSchemaType,
  ResourceSchemaType
} from '../schemas/http';
import { PaginationConstants } from './constants/constants';
import { ResourceCollections } from './constants/enums';

const expandResourceLinks = (
  links: LinksSchemaType,
  collectionUrl: string,
  resourceId: string
): LinksSchemaType =>
  Object.entries(links).reduce((acc, [key, link]) => {
    const href = link.href;
    const expandedHref = href
      .replace('{collection}', collectionUrl)
      .replace('{resource}', resourceId);
    const expandedLink = { ...link, href: expandedHref };
    return { ...acc, [key]: expandedLink };
  }, {});

const getPreviousPage = (page: number, pageSize: number, url: string): string | null =>
  page > 1
    ? `${url}?${PaginationConstants.pageNumberKey}=${page - 1}&${PaginationConstants.pageSizeKey}=${pageSize}`
    : null;

const getNextPage = (
  page: number,
  pageSize: number,
  totalCount: number,
  url: string
): string | null =>
  page * pageSize < totalCount
    ? `${url}?${PaginationConstants.pageNumberKey}=${page + 1}&${PaginationConstants.pageSizeKey}=${pageSize}`
    : null;

const getFirstPage = (pageSize: number, url: string): string =>
  `${url}?${PaginationConstants.pageNumberKey}=1&${PaginationConstants.pageSizeKey}=${pageSize}`;

const getLastPage = (pageSize: number, totalCount: number, url: string): string => {
  const lastPageNumber = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
  return `${url}?${PaginationConstants.pageNumberKey}=${lastPageNumber}&${PaginationConstants.pageSizeKey}=${pageSize}`;
};

const addLinksToCollection = <TData extends TObject>(
  request: FastifyRequest,
  collection: PaginatedCollectionSchemaType<TData> & Pagination,
  collectionLinks: LinksSchemaType = {},
  resourceLinks: LinksSchemaType = {}
): PaginatedCollectionWithLinksSchemaType<TData> => {
  const { page, pageSize, totalCount } = collection;
  const urlNoQuery = request.url.split('?')[0];

  const previousPage = getPreviousPage(page, pageSize, urlNoQuery);
  const nextPage = getNextPage(page, pageSize, totalCount, urlNoQuery);
  const firstPage = getFirstPage(pageSize, urlNoQuery);
  const lastPage = getLastPage(pageSize, totalCount, urlNoQuery);

  const rawData = collection.data as Array<ResourceSchemaType<TData> & Resource>;

  const data = rawData.map((resource) => ({
    ...resource,
    _links: {
      self: { href: `${urlNoQuery}/${resource._id}` },
      collection: { href: urlNoQuery },
      ...expandResourceLinks(resourceLinks, urlNoQuery, resource._id)
    }
  }));

  const collectionWithLinks: PaginatedCollectionWithLinksSchemaType<TData> = {
    ...{ ...collection, data },
    _links: {
      self: { href: request.url },
      ...(previousPage !== null && { prev: { href: previousPage } }),
      ...(nextPage !== null && { next: { href: nextPage } }),
      first: { href: firstPage },
      last: { href: lastPage },
      ...collectionLinks
    }
  };

  return collectionWithLinks;
};

const addLinksToResource = <TData extends TObject>(
  request: FastifyRequest,
  resource: ResourceSchemaType<TData>,
  resourceLinks: LinksSchemaType = {}
): ResourceSchemaType<TData> => {
  const url = request.url.split('?')[0];
  const split = url.split('/');
  const precedingNode = split[split.length - 2];
  const hasCollection = Object.values(ResourceCollections).includes(
    precedingNode as ResourceCollections
  );

  return {
    ...resource,
    _links: {
      self: { href: url },
      ...(hasCollection && { collection: { href: url.replace(`/${resource._id as string}`, '') } }),
      ...resourceLinks
    }
  };
};

export { addLinksToCollection, addLinksToResource };
