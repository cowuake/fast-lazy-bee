import type { FastifyMongodbOptions } from '@fastify/mongodb';
import { MongoDBContainer } from '@testcontainers/mongodb';
import * as fs from 'fs';
import { CONFIG_DEFAULTS } from '../constants/constants';
import { downloadMongoArchive } from './setup-mongo-common';

const setupMongoTestcontainers = async (): Promise<FastifyMongodbOptions> => {
  const archivePath: string = await downloadMongoArchive();
  const mongoArchivePath = '/tmp/sampledata.archive';
  if (!fs.existsSync(archivePath)) {
    throw new Error('Archive path does not exist');
  }
  const startedContainer = await new MongoDBContainer(CONFIG_DEFAULTS.MONGO_IMAGE)
    .withCopyFilesToContainer([
      {
        source: archivePath,
        target: mongoArchivePath
      }
    ])
    .start();

  const result = await startedContainer.exec(['mongorestore', `--archive=${mongoArchivePath}`]);
  if (result.exitCode !== 0) {
    throw new Error(`Failed to restore MongoDB archive: ${result.output}`);
  }

  const connectionString = `mongodb://localhost:${startedContainer.getFirstMappedPort()}/sample_mflix?directConnection=true`;
  return { url: connectionString };
};

export default setupMongoTestcontainers;
