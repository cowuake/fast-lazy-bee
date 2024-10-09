import loveConfig from 'eslint-config-love';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-node';
import prettierPlugin from 'eslint-plugin-prettier';

const languageOptions = {
  parser: typescriptParser,
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json'
  }
};

const plugins = {
  import: importPlugin,
  node: nodePlugin,
  prettier: prettierPlugin,
  '@typescript-eslint': typescriptPlugin
};

export default [
  loveConfig,
  {
    ignores: ['node_modules/*', 'dist/*']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions,
    plugins,
    rules: {
      '@typescript-eslint/no-magic-numbers': 'warn'
    }
  },
  {
    files: ['**/constants.ts', '**/enums.ts', '**/constants.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off'
    }
  },
  {
    files: ['src/schemas/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unnecessary-type-parameters': 'off'
    }
  }
];
