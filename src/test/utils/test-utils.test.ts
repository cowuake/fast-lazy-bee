import type { FastifyMongodbOptions } from '@fastify/mongodb';
import * as fs from 'fs';
import { TEST } from '../../utils/constants/constants';
import { downloadMongoArchive, genRandomPath } from '../../utils/testing/setup-mongo-common';
import setupMongoTestcontainers from '../../utils/testing/setup-mongo-testcontainers';

describe('downloadMongoArchive', () => {
  it(
    'should return the path where the archive was stored',
    async () => {
      const path = genRandomPath();
      const result = await downloadMongoArchive(TEST.MONGO_ARCHIVE_URL, path);
      expect(path).not.toBeNull();
      expect(path).toEqual(result);
      expect(fs.existsSync(result)).toBeTruthy();
      fs.rmSync(result);
    },
    TEST.LONG_TIMEOUT
  );

  it(
    'should fail to download the archive from a wrong URL',
    async () => {
      await expect(downloadMongoArchive(TEST.IMPOSSIBILE_URL, genRandomPath())).rejects.toThrow();
    },
    TEST.LONG_TIMEOUT
  );

  it(
    'should fail to download the archive to a wrong path',
    async () => {
      await expect(
        downloadMongoArchive(TEST.MONGO_ARCHIVE_URL, TEST.IMPOSSIBLE_PATH)
      ).rejects.toThrow();
    },
    TEST.LONG_TIMEOUT
  );
});

describe('setupMongoTestcontainers', () => {
  it(
    'should return FastifyMongodbOptions',
    async () => {
      const options: FastifyMongodbOptions = await setupMongoTestcontainers();
      expect(options).not.toBeNull();
    },
    TEST.LONG_TIMEOUT
  );
});
