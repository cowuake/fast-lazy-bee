import path from 'path';
import os from 'os';
import type { MovieSchemaType } from '../../schemas/movies/data';

class AppConfigDefaults {
  static readonly env = 'development';
  static readonly port = 3000;
  static readonly mongoImage = 'mongo:8';
  static readonly mongoPort = 27027;
  static readonly mongoDbName = 'sample_mflix';
  static readonly mongoUrl = `mongodb://localhost:${this.mongoPort}/${this.mongoDbName}`;
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
  static readonly mongoArchiveUrl = 'https://atlas-education.s3.amazonaws.com/sampledata.archive';
  static readonly mongoArchivePath = path.join(os.tmpdir(), 'sampledata.archive');
  static readonly impossibleUrl = 'www.impossi.bru/nyan/cat?troll=lol';
  static readonly mongoTestcontainersPort = 27028;
  static readonly longTimeout = 120000;
  static readonly v1Root = '/api/v1';
}

class RouteTags {
  static readonly cache = 'Cache';
  static readonly diagnostics = 'Diagnostics';
  static readonly movies = 'Movie Catalog';
  static readonly movie = 'Single Movies';
  static readonly comments = 'Movie Comments';
  static readonly comment = 'Single comments';
}

export { AppConfigDefaults, PaginationDefaults, TestConstants, RouteTags };
