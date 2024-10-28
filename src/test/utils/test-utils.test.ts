import type { FastifyMongodbOptions } from '@fastify/mongodb';
import * as fs from 'fs';
import { TestConstants } from '../../utils/constants/constants';
import { downloadMongoArchive } from '../../utils/testing/setup-mongo-common';
import setupMongoTestcontainers from '../../utils/testing/setup-mongo-testcontainers';

describe('downloadMongoArchive', () => {
  beforeEach(() => {
    if (fs.existsSync(TestConstants.mongoArchivePath)) {
      fs.rmSync(TestConstants.mongoArchivePath);
    }
  });

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

  it(
    'should fail to download the archive from a wrong URL',
    async () => {
      await expect(downloadMongoArchive(TestConstants.impossibleUrl)).rejects.toThrow();
    },
    TestConstants.longTimeout
  );

  it(
    'should fail to download the archive to a wrong path',
    async () => {
      await expect(
        downloadMongoArchive(TestConstants.mongoArchiveUrl, '/quack/archive')
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
