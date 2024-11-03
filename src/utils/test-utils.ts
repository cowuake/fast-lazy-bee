import type { FastifyInstance } from 'fastify';
import type { UserSchemaType } from '../schemas/users/data';
import { TestConstants } from './constants/constants';

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

export { genRandomEmail, genRandomString, getValidToken, waitFor };
