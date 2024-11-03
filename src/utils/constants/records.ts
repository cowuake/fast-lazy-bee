import { HttpStatusCodeDescriptions, HttpStatusCodes } from './enums';

const HttpCodesToDescriptions: Record<HttpStatusCodes, HttpStatusCodeDescriptions> = {
  [HttpStatusCodes.OK]: HttpStatusCodeDescriptions.OK,
  [HttpStatusCodes.Created]: HttpStatusCodeDescriptions.Created,
  [HttpStatusCodes.NoContent]: HttpStatusCodeDescriptions.NoContent,
  [HttpStatusCodes.NotModified]: HttpStatusCodeDescriptions.NotModified,
  [HttpStatusCodes.BadRequest]: HttpStatusCodeDescriptions.BadRequest,
  [HttpStatusCodes.Unauthorized]: HttpStatusCodeDescriptions.Unauthorized,
  [HttpStatusCodes.Conflict]: HttpStatusCodeDescriptions.Conflict,
  [HttpStatusCodes.NotFound]: HttpStatusCodeDescriptions.NotFound,
  [HttpStatusCodes.InternalServerError]: HttpStatusCodeDescriptions.InternalServerError
};

export { HttpCodesToDescriptions };
