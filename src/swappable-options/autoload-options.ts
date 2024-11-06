import type { AutoloadPluginOptions } from '@fastify/autoload';
import { join } from 'path';
import { APIV1Prefix } from '../utils/constants/constants';

const autoloadPluginsOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../plugins')
};
const autoloadRoutesOptions: AutoloadPluginOptions = {
  dir: join(__dirname, '../routes'),
  autoHooks: true,
  cascadeHooks: true,
  dirNameRoutePrefix: false,
  options: { prefix: APIV1Prefix }
};

const autoloadOptions = [autoloadPluginsOptions, autoloadRoutesOptions];

export default autoloadOptions;
