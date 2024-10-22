import type { FastifyError } from 'fastify';
import { mapFastifyErrorToErrorSchemaType } from '../plugins/error-handling';
import { HttpStatusCodes } from '../utils/constants/enums';

describe('mapFastifyErrorToErrorSchemaType', () => {
  it('should return an error schema type', () => {
    const fastifyError: FastifyError = {
      statusCode: HttpStatusCodes.BadRequest,
      name: 'BadRequest',
      message: 'Bad Request',
      code: 'FST_ERR_CTP_INVALID_JSON'
    };
    const error = mapFastifyErrorToErrorSchemaType(fastifyError);

    expect(error).toEqual({
      status: HttpStatusCodes.BadRequest,
      detail: 'Bad Request',
      code: 'FST_ERR_CTP_INVALID_JSON',
      errors: undefined
    });
  });
});
