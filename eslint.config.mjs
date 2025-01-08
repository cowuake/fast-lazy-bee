import typescriptParser from '@typescript-eslint/parser';
import loveConfig from 'eslint-config-love';

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
  prettier: prettierPlugin
  // '@typescript-eslint': typescriptPlugin
};

export default [
  loveConfig,
  {
    ignores: ['node_modules/*', 'dist/*', 'coverage/*']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions,
    plugins,
    rules: {
      '@typescript-eslint/no-magic-numbers': 'warn',
      '@typescript-eslint/no-extraneous-class': 'warn'
    }
  },
  {
    files: ['**/constants.ts', '**/enums.ts', 'src/schemas/**/*.ts'],
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
