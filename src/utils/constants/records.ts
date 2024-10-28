import { HttpStatusCodes, HttpStatusCodeDescriptions } from './enums';

const HttpCodesToDescriptions: Record<HttpStatusCodes, HttpStatusCodeDescriptions> = {
  [HttpStatusCodes.OK]: HttpStatusCodeDescriptions.OK,
  [HttpStatusCodes.Created]: HttpStatusCodeDescriptions.Created,
  [HttpStatusCodes.NoContent]: HttpStatusCodeDescriptions.NoContent,
  [HttpStatusCodes.BadRequest]: HttpStatusCodeDescriptions.BadRequest,
  [HttpStatusCodes.Conflict]: HttpStatusCodeDescriptions.Conflict,
  [HttpStatusCodes.NotFound]: HttpStatusCodeDescriptions.NotFound,
  [HttpStatusCodes.InternalServerError]: HttpStatusCodeDescriptions.InternalServerError
};

export { HttpCodesToDescriptions };
