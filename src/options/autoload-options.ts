import { join } from 'path';
import type { AutoloadPluginOptions } from '@fastify/autoload';

const autoloadPluginsOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../plugins')
};
const autoloadRoutesOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../routes'),
  autoHooks: true
};

const autoloadOptions = [autoloadPluginsOptions, autoloadRoutesOptions];

export default autoloadOptions;
