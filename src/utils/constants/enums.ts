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

enum MediaTypes {
  Movie = 'movie',
  Series = 'series'
}

enum HttpMediaTypes {
  TEXT_PLAIN = 'text/plain',
  JSON = 'application/json',
  HAL_JSON = 'application/hal+json'
}

enum FetchTypes {
  Resource = 'resource',
  Collection = 'collection'
}

enum ResourceTypes {
  Movie = 'movie',
  MovieComment = 'comment',
  User = 'user'
}

enum SecuritySchemes {
  BearerAuth = 'BearerAuth'
}

enum IsolatedResourceTypes {
  Login = 'login',
  Health = 'health'
}

enum ResourceCollections {
  Movies = 'movies',
  MovieComments = 'comments',
  Users = 'users'
}

enum RouteTags {
  EntryPoint = 'API Entry Point',
  Auth = 'User Registration/Authentication/Authorization',
  Cache = 'Cacheable Operations',
  Comments = 'Movie Comment Collection',
  Diagnostics = 'Diagnostics',
  Movie = 'Movie Resources',
  Movies = 'Movie Collection',
  Users = 'User Collection',
  OPTIONS = 'OPTIONS'
}

export {
  FetchTypes,
  HttpMediaTypes,
  HttpMethods,
  HttpStatusCodes,
  IsolatedResourceTypes,
  MediaTypes,
  ResourceCollections,
  ResourceTypes,
  RouteTags,
  SecuritySchemes
};
