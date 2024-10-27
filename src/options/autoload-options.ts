import { join } from 'path';
import type { AutoloadPluginOptions } from '@fastify/autoload';

const autoloadPluginsOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../plugins')
};
const autoloadRoutesOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../routes'),
  autoHooks: true,
  cascadeHooks: true,
  dirNameRoutePrefix: true,
  options: { prefix: '/api/v1' }
};

const autoloadOptions = [autoloadPluginsOptions, autoloadRoutesOptions];

export default autoloadOptions;
