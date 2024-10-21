import path from 'path';
import { TestConstants } from '../constants/constants';
import fs from 'fs';
import os from 'os';

const downloadMongoArchive = async (): Promise<string> => {
  const archiveUrl = TestConstants.mongoArchiveUrl;
  const tempDir = os.tmpdir();
  const archivePath = path.join(tempDir, 'sampledata.archive');

  if (!fs.existsSync(archivePath)) {
    try {
      const response = await fetch(archiveUrl);
      if (!response.ok) {
        throw new Error(`Failed to download archive: ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(archivePath, Buffer.from(buffer));
    } catch (error) {
      console.error(error);
    }
  }

  return archivePath;
};

export { downloadMongoArchive };
