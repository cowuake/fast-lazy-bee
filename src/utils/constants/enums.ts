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
  BadRequest = 400,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500
}

enum HttpStatusCodeDescriptions {
  OK = 'Success (OK)',
  Created = 'Success (Created)',
  NoContent = 'Client Error (No Content)',
  BadRequest = 'Client Error (Bad Request)',
  NotFound = 'Client Error (Not Found)',
  InternalServerError = 'Server Error (Internal Server Error)'
}

export { HttpMethods, HttpStatusCodes, HttpStatusCodeDescriptions };
