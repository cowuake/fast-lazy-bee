import { MovieSchemaType } from '../schemas/movies/data';

export class AppConfigDefaults {
  static readonly env = 'development';
  static readonly port = 3000;
  static readonly mongoUrl = 'mongodb://localhost:27027/sample_mflix';
}

export class PaginationDefaults {
  static readonly defaultPageNumber = 1;
  static readonly minimumPageNumber = 1;
  static readonly defaultPageSize = 100;
  static readonly maximumPageSize = 500;
  static readonly minimumPageSize = 1;
}

export class TestConstants {
  static readonly magicId = '670f5e20c286545ba702aade';
  static readonly testMovie: MovieSchemaType = { title: 'Test Movie', type: 'movie', year: 2024 };
}
