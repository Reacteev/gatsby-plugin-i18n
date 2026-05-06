/* eslint-disable import/no-unresolved */
import { defineConfig, globalIgnores } from 'eslint/config';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['.cache', 'node_modules', 'coverage', '.yarn']),
  {
    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@ecocode/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jest/all',
        'plugin:jsx-a11y/strict',
        'plugin:sonarjs/recommended',
      ),
    ),

    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      jest: fixupPluginRules(jest),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },

      ecmaVersion: 2020,
      sourceType: 'module',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      curly: ['error', 'all'],

      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
        },
      ],

      'jest/max-expects': ['off'],
      'jest/no-large-snapshots': 'off',
      'jest/require-hook': 'off',

      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link', 'LocalizedLink'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],

      'no-console': [
        'error',
        {
          allow: ['error', 'warn', 'info'],
        },
      ],

      'object-curly-newline': 'off',
      'object-curly-spacing': ['error', 'always'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
]);
