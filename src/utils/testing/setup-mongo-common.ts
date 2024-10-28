import fs from 'fs';
import path from 'path';
import { TestConstants } from '../constants/constants';

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
      throw new Error(`Failed to download archive: ${error}`);
    }
  }

  return archivePath;
};

export { downloadMongoArchive };
