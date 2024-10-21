import setupMongoTestcontainers from '../../utils/testing/setup-mongo-testcontainers';
import { downloadMongoArchive } from '../../utils/testing/setup-mongo-common';
import * as fs from 'fs';
import type { FastifyMongodbOptions } from '@fastify/mongodb';
import { TestConstants } from '../../utils/constants/constants';

describe('downloadMongoArchive', () => {
  it(
    'should return the path where the archive was stored',
    async () => {
      const path = await downloadMongoArchive();
      expect(path).not.toBeNull();
      const exists = fs.existsSync(path);
      expect(exists).toBeTruthy();
    },
    TestConstants.longTimeout
  );
});

describe('setupMongoTestcontainers', () => {
  it(
    'should return FastifyMongodbOptions',
    async () => {
      const options: FastifyMongodbOptions = await setupMongoTestcontainers();
      expect(options).not.toBeNull();
    },
    TestConstants.longTimeout
  );
});
