import fs from 'fs';
import os from 'os';
import path from 'path';
import { TestConstants } from '../constants/constants';

const genRandomPath = (): string => {
  return path.join(os.tmpdir(), Math.random().toString(36).substring(7));
};

const downloadMongoArchive = async (
  archiveUrl: string = TestConstants.mongoArchiveUrl,
  archivePath: string = TestConstants.mongoArchivePath
): Promise<string> => {
  if (!fs.existsSync(archivePath)) {
    try {
      const response = await fetch(archiveUrl);
      if (!response.ok) {
        throw new Error(`Failed to download archive: ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      const dir = path.dirname(archivePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(archivePath, Buffer.from(buffer));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to download archive: ${errorMessage}`);
    }
  }

  return archivePath;
};

export { downloadMongoArchive, genRandomPath };
