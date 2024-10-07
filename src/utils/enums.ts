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
  NotFound = 404
}

export { HttpMethods, HttpStatusCodes };
