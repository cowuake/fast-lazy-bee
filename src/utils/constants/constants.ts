import os from 'os';
import path from 'path';

const CONFIG_DEFAULTS = {
  ENV: 'development',
  PORT: 3000,
  MONGO_IMAGE: 'mongo:8',
  MONGO_PORT: 27027,
  MONGO_DB_NAME: 'sample_mflix',
  MONGO_URL: 'mongodb://localhost:27027/sample_mflix',
  CACHE_EXPIRATION_S: 10
} as const;

const PAGINATION = {
  DEFAULT_PAGE_NUMBER: 1,
  MINIMUM_PAGE_NUMBER: 1,
  DEFAULT_PAGE_SIZE: 100,
  MAXIMUM_PAGE_SIZE: 500,
  MINIMUM_PAGE_SIZE: 1,
  PAGE_NUMBER_KEY: 'page',
  PAGE_SIZE_KEY: 'pageSize',
  TOTAL_COUNT_KEY: 'totalCount'
} as const;

const TEST = {
  FAKE_MOVIE_ID: '000000000000000000000000',
  MAGIC_MOVIE_ID: '670f5e20c286545ba702aade',
  TEST_MOVIE: { title: 'Test Movie', type: 'movie', year: 2024 },
  MONGO_ARCHIVE_URL: 'https://atlas-education.s3.amazonaws.com/sampledata.archive',
  MONGO_ARCHIVE_PATH: path.join(os.tmpdir(), 'sampledata.archive'),
  IMPOSSIBILE_URL: 'hifi://www.impossi.bru/nyan/cat?troll=lol',
  IMPOSSIBLE_PATH: '/quack/archive',
  IMPOSSIBLE_EMAIL: 'impossibru@nyan.cat.trollolol',
  IMPOSSIBLE_PASSWORD: 'waddayamean?!?!',
  MONGO_TESTCONTAINERS_PORT: 27028,
  LONG_TIMEOUT: 120000,
  V1_ROOT: '/api/v1',
  USER_NAME: 'Tyrion Lannister',
  USER_EMAIL: 'peter_dinklage@gameofthron.es',
  USER_PASSWORD: '$2b$12$xtHwQNXYlQzP2REobUDlzuQimjzBlXrTx1GnwP.xkfULeuuUpRxa2'
} as const;

const API_V1_PREFIX = '/api/v1';
const OPENAPI_DOCS_PREFIX = '/docs';

const API_ENDPOINTS = {
  ENTRY_POINT: '/',
  LOGIN: '/login',
  HEALTH: '/health',
  USERS: '/users',
  MOVIES: '/movies',
  MOVIE: '/movies/:movie_id',
  MOVIE_COMMENTS: '/movies/:movie_id/comments'
} as const;

const MOVIE_ENDPOINT = (id: string): string => API_ENDPOINTS.MOVIE.replace(':movie_id', id);
const MOVIE_COMMENTS_ENDPOINT = (id: string): string =>
  API_ENDPOINTS.MOVIE_COMMENTS.replace(':movie_id', id);

export {
  API_ENDPOINTS,
  API_V1_PREFIX,
  CONFIG_DEFAULTS,
  MOVIE_COMMENTS_ENDPOINT,
  MOVIE_ENDPOINT,
  OPENAPI_DOCS_PREFIX,
  PAGINATION,
  TEST
};
