import { HttpStatusCodes, ResourceCollections, ResourceTypes, RouteTags } from './enums';

const HttpCodesToDescriptions: Record<HttpStatusCodes, string> = {
  [HttpStatusCodes.OK]: 'Success (OK)',
  [HttpStatusCodes.Created]: 'Success (Created)',
  [HttpStatusCodes.NoContent]: 'Client Error (No Content)',
  [HttpStatusCodes.NotModified]: 'Redirection (Not Modified)',
  [HttpStatusCodes.BadRequest]: 'Client Error (Bad Request)',
  [HttpStatusCodes.Unauthorized]: 'Client Error (Unauthorized)',
  [HttpStatusCodes.NotFound]: 'Client Error (Not Found)',
  [HttpStatusCodes.Conflict]: 'Client Error (Conflict)',
  [HttpStatusCodes.InternalServerError]: 'Server Error (Internal Server Error)'
} as const;

const RouteTagsToDescriptions: Record<RouteTags, string> = {
  [RouteTags.EntryPoint]: 'The entry point of the API',
  [RouteTags.Diagnostics]: 'GET routes for getting API diagnostics info',
  [RouteTags.Auth]: 'Routes for user registration, authentication, and authorization',
  [RouteTags.Movies]: 'Routes for manipulating the movie collection',
  [RouteTags.Movie]: 'Routes for manipulating movie resources',
  [RouteTags.Comments]: 'Routes for manipulating the movie comment collection',
  [RouteTags.Users]: 'Routes for manipulating the user collection',
  [RouteTags.Cache]: 'Cacheable routes',
  [RouteTags.OPTIONS]: 'Auto-generated OPTIONS routes, allowing CORS preflight checks'
} as const;

const ResourcesToCollections: Record<ResourceTypes, ResourceCollections> = {
  [ResourceTypes.Movie]: ResourceCollections.Movies,
  [ResourceTypes.MovieComment]: ResourceCollections.MovieComments,
  [ResourceTypes.User]: ResourceCollections.Users
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
