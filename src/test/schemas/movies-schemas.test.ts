import { TypeCompiler } from '@sinclair/typebox/compiler';
import { MovieSchema, type MovieSchemaType } from '../../schemas/movies/data';
import { MediaTypes } from '../../utils/constants/enums';

describe('MovieSchema', () => {
  const validate = TypeCompiler.Compile(MovieSchema);

  const movieTitle = 'Yet Another Movie';
  const mediaType = MediaTypes.MOVIE;
  const movieYear = 2022;

  const movieWithMandatoryFields: MovieSchemaType = {
    title: movieTitle,
    type: mediaType,
    year: movieYear
  };

  it('should validate a movie with at least the mandatory fields', () => {
    const validMovie = movieWithMandatoryFields;
    expect(validate.Check(validMovie)).toBe(true);
  });

  it('should not validate a movie without an empty cast', () => {
    const invalidMovie = { ...movieWithMandatoryFields, cast: [] };
    expect(validate.Check(invalidMovie)).toBe(false);
  });

  it('should not validate a movie without a title', () => {
    const invalidMovie = { ...movieWithMandatoryFields, title: '' };
    expect(validate.Check(invalidMovie)).toBe(false);
  });

  it('should not validate a movie without a type', () => {
    const invalidMovie = { ...movieWithMandatoryFields, type: '' };
    expect(validate.Check(invalidMovie)).toBe(false);
  });
});
