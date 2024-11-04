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

const addLinksToCollection = <TData extends TObject>(
  request: FastifyRequest,
  collection: PaginatedCollectionSchemaType<TData> & Pagination,
  collectionLinks: LinksSchemaType = {},
  resourceLinks: LinksSchemaType = {}
): PaginatedCollectionWithLinksSchemaType<TData> => {
  const page = collection.page;
  const pageSize = collection.pageSize;
  const urlNoQuery = request.url.split('?')[0];
  const pageSizeQuery = `${PaginationConstants.pageSizeKey}=${pageSize}`;
  const previousPage =
    page > 1
      ? `${urlNoQuery}?${PaginationConstants.pageNumberKey}=${page - 1}&` + pageSizeQuery
      : null;
  const nextPage =
    page * pageSize < collection.totalCount
      ? `${urlNoQuery}?${PaginationConstants.pageNumberKey}=${page + 1}&` + pageSizeQuery
      : null;
  const firstPage = `${urlNoQuery}?${PaginationConstants.pageNumberKey}=1&` + pageSizeQuery;
  const lastPage =
    `${urlNoQuery}?${PaginationConstants.pageNumberKey}=${pageSize > 1 ? Math.ceil(collection.totalCount / pageSize) : 0}&` +
    pageSizeQuery;

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
