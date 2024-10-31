import os from 'os';
import path from 'path';

const AppConfigDefaults = {
  env: 'development',
  port: 3000,
  mongoImage: 'mongo:8',
  mongoPort: 27027,
  mongoDbName: 'sample_mflix',
  mongoUrl: 'mongodb://localhost:27027/sample_mflix',
  cacheExpiration: 10000
} as const;

const PaginationConstants = {
  defaultPageNumber: 1,
  minimumPageNumber: 1,
  defaultPageSize: 100,
  maximumPageSize: 500,
  minimumPageSize: 1,
  pageNumberKey: 'page',
  pageSizeKey: 'pageSize',
  totalCountKey: 'totalCount'
} as const;

const TestConstants = {
  fakeId: '000000000000000000000000',
  magicId: '670f5e20c286545ba702aade',
  testMovie: { title: 'Test Movie', type: 'movie', year: 2024 },
  mongoArchiveUrl: 'https://atlas-education.s3.amazonaws.com/sampledata.archive',
  mongoArchivePath: path.join(os.tmpdir(), 'sampledata.archive'),
  impossibleUrl: 'www.impossi.bru/nyan/cat?troll=lol',
  mongoTestcontainersPort: 27028,
  longTimeout: 120000,
  v1Root: '/api/v1'
} as const;

const RouteTags = {
  cache: 'Cache',
  diagnostics: 'Diagnostics',
  movies: 'Movie Catalog',
  movie: 'Single Movies',
  comments: 'Movie Comments',
  comment: 'Single comments'
} as const;

export { AppConfigDefaults, PaginationConstants, RouteTags, TestConstants };
