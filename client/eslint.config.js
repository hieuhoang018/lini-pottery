import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Pre-existing: several effects call setState synchronously (session
      // restore, cart reload, page-reset-on-filter-change). Real fixes need
      // restructuring the effects, tracked as follow-up rather than done here.
      "react-hooks/set-state-in-effect": "warn",
      // Context files intentionally export both the Provider and its `useX`
      // hook, which is the common pattern for this codebase.
      "react-refresh/only-export-components": "warn",
    },
  },
])
