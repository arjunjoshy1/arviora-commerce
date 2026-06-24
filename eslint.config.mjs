import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Things we never lint.
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.config.{js,ts,mjs,cjs}',
      '**/prisma/migrations/**',
      '**/.prisma/**',
      'design/**',
      'packages/shared/dist/**',
    ],
  },

  // Base JS + TypeScript recommended rules (non type-checked = fast).
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Shared project-wide rule tweaks.
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Frontend (React, browser globals).
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Backend + scripts (Node globals).
  {
    files: ['apps/api/**/*.ts', 'packages/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Disable formatting rules that would fight Prettier (keep this last).
  prettier,
);
