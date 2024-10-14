import type { MovieSchemaType } from '../schemas/movies/data';

class AppConfigDefaults {
  static readonly env = 'development';
  static readonly port = 3000;
  static readonly mongoUrl = 'mongodb://localhost:27027/sample_mflix';
  static readonly cacheExpiration = 10000;
}

class PaginationDefaults {
  static readonly defaultPageNumber = 1;
  static readonly minimumPageNumber = 1;
  static readonly defaultPageSize = 100;
  static readonly maximumPageSize = 500;
  static readonly minimumPageSize = 1;
}

class TestConstants {
  static readonly fakeId = '000000000000000000000000';
  static readonly magicId = '670f5e20c286545ba702aade';
  static readonly testMovie: MovieSchemaType = { title: 'Test Movie', type: 'movie', year: 2024 };
}

class RouteTags {
  static readonly cache = 'Cache';
  static readonly diagnostics = 'Diagnostics';
  static readonly movies = 'Movies';
}

export { AppConfigDefaults, PaginationDefaults, TestConstants, RouteTags };
