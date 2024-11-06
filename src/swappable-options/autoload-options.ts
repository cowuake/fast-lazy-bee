import type { AutoloadPluginOptions } from '@fastify/autoload';
import { join } from 'path';
import { API_V1_PREFIX } from '../utils/constants/constants';

const autoloadPluginsOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../plugins')
};
const autoloadRoutesOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../routes'),
  autoHooks: true,
  cascadeHooks: true,
  dirNameRoutePrefix: false,
  options: { prefix: API_V1_PREFIX }
};

const autoloadOptions = [autoloadPluginsOptions, autoloadRoutesOptions];

export default autoloadOptions;
