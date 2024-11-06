import { HttpStatusCodes, ResourceCollections, ResourceTypes, RouteTags } from './enums';

const HttpCodesToDescriptions: Record<HttpStatusCodes, string> = {
  [HttpStatusCodes.OK]: 'Success (OK)',
  [HttpStatusCodes.CREATED]: 'Success (Created)',
  [HttpStatusCodes.NO_CONTENT]: 'Client Error (No Content)',
  [HttpStatusCodes.NOT_MODIFIED]: 'Redirection (Not Modified)',
  [HttpStatusCodes.BAD_REQUEST]: 'Client Error (Bad Request)',
  [HttpStatusCodes.UNAUTHORIZED]: 'Client Error (Unauthorized)',
  [HttpStatusCodes.NOT_FOUND]: 'Client Error (Not Found)',
  [HttpStatusCodes.CONFLICT]: 'Client Error (Conflict)',
  [HttpStatusCodes.INTERNAL_SERVER_ERROR]: 'Server Error (Internal Server Error)'
} as const;

const RouteTagsToDescriptions: Record<RouteTags, string> = {
  [RouteTags.ENTRY_POINT]: 'The entry point of the API',
  [RouteTags.DIAGNOSTICS]: 'GET routes for getting API diagnostics info',
  [RouteTags.AUTH]: 'Routes for user registration, authentication, and authorization',
  [RouteTags.MOVIES]: 'Routes for manipulating the movie collection',
  [RouteTags.MOVIE]: 'Routes for manipulating movie resources',
  [RouteTags.COMMENTS]: 'Routes for manipulating the movie comment collection',
  [RouteTags.USERS]: 'Routes for manipulating the user collection',
  [RouteTags.CACHE]: 'Cacheable routes',
  [RouteTags.OPTIONS]: 'Auto-generated OPTIONS routes, allowing CORS preflight checks'
} as const;

const ResourcesToCollections: Record<ResourceTypes, ResourceCollections> = {
  [ResourceTypes.MOVIE]: ResourceCollections.MOVIES,
  [ResourceTypes.MOVIE_COMMENT]: ResourceCollections.MOVIE_COMMENTS,
  [ResourceTypes.USER]: ResourceCollections.USERS
} as const;

const CollectionsToResources: Record<ResourceCollections, ResourceTypes> = Object.fromEntries(
  Object.entries(ResourcesToCollections).map(([key, value]) => [value, key])
) as Record<ResourceCollections, ResourceTypes>;

export {
  CollectionsToResources,
  HttpCodesToDescriptions,
  ResourcesToCollections,
  RouteTagsToDescriptions
};
