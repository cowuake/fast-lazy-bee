import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, type Db, Collection } from 'mongodb';
import type { FastifyInstance } from 'fastify';
import movieAutoHooks from './autohooks';
import type { MovieSchemaType } from '../../../schemas/movies/data';
import fastify from 'fastify';

const mongod: MongoMemoryServer = await MongoMemoryServer.create();
const uri = mongod.getUri();
const client: MongoClient = new MongoClient(uri);
const db: Db = client.db();
const movies: Collection<MovieSchemaType> = new Collection<MovieSchemaType>();
const fastifyInstance: FastifyInstance = fastify({});

before(async () => {
  await fastifyInstance.register(movieAutoHooks);
  await fastifyInstance.ready();
});

beforeAll(async () => {
  await mongod.start();
  await client.connect();
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe('movieAutoHooks', () => {
  beforeEach(async () => {});
});
