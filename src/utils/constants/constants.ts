import os from 'os';
import path from 'path';

const AppConfigDefaults = {
  env: 'development',
  port: 3000,
  mongoImage: 'mongo:8',
  mongoPort: 27027,
  mongoDbName: 'sample_mflix',
  mongoUrl: 'mongodb://localhost:27027/sample_mflix',
  cacheExpiration_s: 10
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
  impossibleUrl: 'hifi://www.impossi.bru/nyan/cat?troll=lol',
  impossiblePath: '/quack/archive',
  impossibleEmail: 'impossibru@nyan.cat.trollolol',
  impossiblePassword: 'waddayamean?!?!',
  mongoTestcontainersPort: 27028,
  longTimeout: 120000,
  v1Root: '/api/v1',
  userName: 'Tyrion Lannister',
  userEmail: 'peter_dinklage@gameofthron.es',
  userPassword: '$2b$12$xtHwQNXYlQzP2REobUDlzuQimjzBlXrTx1GnwP.xkfULeuuUpRxa2'
} as const;

const APIV1Prefix = '/api/v1';
const OpenAPIDocsPrefix = '/docs';

const APIEndpoints = {
  EntryPoint: '/',
  Login: '/login',
  Health: '/health',
  Users: '/users',
  Movies: '/movies',
  Movie: '/movies/:movie_id',
  MovieComments: '/movies/:movie_id/comments'
} as const;

const MovieEndpoint = (id: string): string => APIEndpoints.Movie.replace(':movie_id', id);
const MovieCommentsEndpoint = (id: string): string =>
  APIEndpoints.MovieComments.replace(':movie_id', id);

export {
  APIEndpoints,
  APIV1Prefix,
  AppConfigDefaults,
  MovieCommentsEndpoint,
  MovieEndpoint,
  OpenAPIDocsPrefix,
  PaginationConstants,
  TestConstants
};
