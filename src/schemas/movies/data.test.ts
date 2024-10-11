import { MovieSchema } from './data';
import { TypeCompiler } from '@sinclair/typebox/compiler';

describe('MovieSchema', () => {
  const validate = TypeCompiler.Compile(MovieSchema);
  const movieTitle = 'Yet Another Movie';
  const movieType = 'movie';

  it('should validate a valid movie', () => {
    const validUser = {
      title: movieTitle,
      type: movieType
    };
    expect(validate.Check(validUser)).toBe(true);
  });

  it('should not validate a movie without a title', () => {
    const invalidUser = {
      type: movieType
    };
    expect(validate.Check(invalidUser)).toBe(false);
  });

  it('should not validate a movie without a type', () => {
    const invalidUser = {
      title: movieTitle
    };
    expect(validate.Check(invalidUser)).toBe(false);
  });
});
