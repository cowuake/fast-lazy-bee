import type { TObject } from '@sinclair/typebox';
import type { FastifyRequest } from 'fastify';
import type {
  LinksSchemaType,
  PaginatedCollectionSchemaType,
  PaginatedCollectionWithLinksSchemaType,
  ResourceSchemaType
} from '../schemas/http';
import { PAGINATION } from './constants/constants';
import { ResourceCollections } from './constants/enums';
import { getFirstPage, getLastPage, getNextPage, getPreviousPage } from './pagination-utils';

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

const getPreviousPageLink = (page: number, pageSize: number, url: string): string | null => {
  const previousPage = getPreviousPage(page, pageSize);
  const link =
    previousPage !== null
      ? `${url}?${PAGINATION.PAGE_NUMBER_KEY}=${previousPage}&${PAGINATION.PAGE_SIZE_KEY}=${pageSize}`
      : null;
  return link;
};

const getNextPageLink = (
  page: number,
  pageSize: number,
  totalCount: number,
  url: string
): string | null => {
  const nextPage = getNextPage(page, pageSize, totalCount);
  const link =
    nextPage !== null
      ? `${url}?${PAGINATION.PAGE_NUMBER_KEY}=${nextPage}&${PAGINATION.PAGE_SIZE_KEY}=${pageSize}`
      : null;
  return link;
};

const getFirstPageLink = (pageSize: number, url: string): string => {
  const firstpage = getFirstPage();
  const link = `${url}?${PAGINATION.PAGE_NUMBER_KEY}=${firstpage}&${PAGINATION.PAGE_SIZE_KEY}=${pageSize}`;
  return link;
};

const getLastPageLink = (pageSize: number, totalCount: number, url: string): string => {
  const lastPage = getLastPage(pageSize, totalCount);
  return `${url}?${PAGINATION.PAGE_NUMBER_KEY}=${lastPage}&${PAGINATION.PAGE_SIZE_KEY}=${pageSize}`;
};

const addLinksToCollection = <TData extends TObject>(
  request: FastifyRequest,
  collection: PaginatedCollectionSchemaType<TData> & Pagination,
  collectionLinks: LinksSchemaType = {},
  resourceLinks: LinksSchemaType = {}
): PaginatedCollectionWithLinksSchemaType<TData> => {
  const { page, pageSize, totalCount } = collection;
  const urlNoQuery = request.url.split('?')[0];

  const previousPage = getPreviousPageLink(page, pageSize, urlNoQuery);
  const nextPage = getNextPageLink(page, pageSize, totalCount, urlNoQuery);
  const firstPage = getFirstPageLink(pageSize, urlNoQuery);
  const lastPage = getLastPageLink(pageSize, totalCount, urlNoQuery);

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

export {
  addLinksToCollection,
  addLinksToResource,
  getFirstPageLink,
  getLastPageLink,
  getNextPageLink,
  getPreviousPageLink
};
