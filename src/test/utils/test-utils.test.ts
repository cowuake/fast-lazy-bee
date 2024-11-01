import type { FastifyMongodbOptions } from '@fastify/mongodb';
import * as fs from 'fs';
import { TestConstants } from '../../utils/constants/constants';
import { downloadMongoArchive, genRandomPath } from '../../utils/testing/setup-mongo-common';
import setupMongoTestcontainers from '../../utils/testing/setup-mongo-testcontainers';

describe('downloadMongoArchive', () => {
  it(
    'should return the path where the archive was stored',
    async () => {
      const path = genRandomPath();
      const result = await downloadMongoArchive(TestConstants.mongoArchiveUrl, path);
      expect(path).not.toBeNull();
      expect(path).toEqual(result);
      expect(fs.existsSync(result)).toBeTruthy();
      fs.rmSync(result);
    },
    TestConstants.longTimeout
  );

  it(
    'should fail to download the archive from a wrong URL',
    async () => {
      await expect(
        downloadMongoArchive(TestConstants.impossibleUrl, genRandomPath())
      ).rejects.toThrow();
    },
    TestConstants.longTimeout
  );

  it(
    'should fail to download the archive to a wrong path',
    async () => {
      await expect(
        downloadMongoArchive(TestConstants.mongoArchiveUrl, TestConstants.impossiblePath)
      ).rejects.toThrow();
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
