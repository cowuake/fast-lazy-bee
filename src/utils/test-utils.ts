import type { FastifyInstance } from 'fastify';
import type { Response } from 'light-my-request';
import type { UserSchemaType } from '../schemas/users/data';
import { TestConstants } from './constants/constants';
import { FetchTypes, HttpMediaTypes, HttpStatusCodes } from './constants/enums';

const waitFor = async (seconds: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const getValidToken = (fastify: FastifyInstance): string => {
  const user: UserSchemaType = {
    name: TestConstants.userName,
    email: TestConstants.userEmail,
    password: TestConstants.userPassword
  };

  return fastify.jwt.sign(user, { expiresIn: '1m' });
};

const genRandomString = (): string => Math.random().toString(36).substring(2);
const genRandomEmail = (): string => `${genRandomString()}@example.com`;

const expectCachedResponse = (response: Response): void => {
  expect(response.headers.age).toBeDefined();
};

const expectNotCachedResponse = (response: Response): void => {
  expect(response.headers.age).toBeUndefined();
};

const expectHalResponse = (response: Response, type: FetchTypes): void => {
  expect(response.statusCode).toBe(HttpStatusCodes.OK);
  expect(response.headers).toHaveProperty('content-type');
  expect(response.headers['content-type']).toMatch(HttpMediaTypes.HAL_JSON.valueOf());
  expect(response.json()).toHaveProperty(type === FetchTypes.Collection ? 'data' : '_id');
  expect(response.json()).toHaveProperty('_links');
};

export {
  expectCachedResponse,
  expectHalResponse,
  expectNotCachedResponse,
  genRandomEmail,
  genRandomString,
  getValidToken,
  waitFor
};
