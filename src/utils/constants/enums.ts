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
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

enum MediaTypes {
  MOVIE = 'movie',
  SERIES = 'series'
}

enum HttpMediaTypes {
  TEXT_PLAIN = 'text/plain',
  JSON = 'application/json',
  HAL_JSON = 'application/hal+json'
}

enum FetchTypes {
  RESOURCE = 'resource',
  COLLECTION = 'collection'
}

enum ResourceTypes {
  MOVIE = 'movie',
  MOVIE_COMMENT = 'comment',
  USER = 'user'
}

enum SecuritySchemes {
  BEARER_AUTH = 'BearerAuth'
}

enum IsolatedResourceTypes {
  LOGIN = 'login',
  HEALTH = 'health'
}

enum ResourceCollections {
  MOVIES = 'movies',
  MOVIE_COMMENTS = 'comments',
  USERS = 'users'
}

enum RouteTags {
  ENTRY_POINT = 'API Entry Point',
  AUTH = 'User Registration/Authentication/Authorization',
  CACHE = 'Cacheable Operations',
  COMMENTS = 'Movie Comment Collection',
  DIAGNOSTICS = 'Diagnostics',
  MOVIE = 'Movie Resources',
  MOVIES = 'Movie Collection',
  USERS = 'User Collection',
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
