enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD'
}

enum HttpStatusCodes {
  OK = 200,
  Created = 201,
  NoContent = 204,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500
}

enum HttpStatusCodeDescriptions {
  OK = 'Success (OK)',
  Created = 'Success (Created)',
  NoContent = 'Client Error (No Content)',
  NotModified = 'Redirection (Not Modified)',
  BadRequest = 'Client Error (Bad Request)',
  Unauthorized = 'Client Error (Unauthorized)',
  NotFound = 'Client Error (Not Found)',
  Conflict = 'Client Error (Conflict)',
  InternalServerError = 'Server Error (Internal Server Error)'
}

enum MediaTypes {
  Movie = 'movie',
  Series = 'series'
}

enum HttpMediaTypes {
  JSON = 'application/json',
  HAL_JSON = 'application/hal+json'
}

enum FetchTypes {
  Resource = 'resource',
  Collection = 'collection'
}

enum ResourceTypes {
  Movie = 'Movie',
  MovieComment = 'MovieComment',
  User = 'User'
}

enum SecuritySchemes {
  BearerAuth = 'BearerAuth'
}

enum RouteTags {
  Auth = 'User registration/authentication/authorization',
  Cache = 'Cacheable Operations',
  Comment = 'Movie Comment Resources',
  Comments = 'Movie Comment Collection',
  Diagnostics = 'Diagnostics',
  Movie = 'Movie Resources',
  Movies = 'Movie Collection',
  Users = 'User Collection'
}

export {
  FetchTypes,
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodeDescriptions,
  HttpStatusCodes,
  MediaTypes,
  ResourceTypes,
  RouteTags,
  SecuritySchemes
};
