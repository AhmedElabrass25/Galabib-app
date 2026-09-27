# React + TypeScript + Vite

## Environment variables

Copy `.env.example` to `.env` and fill in the Supabase project URL and anon key for local development. Local `.env` files are ignored by Git.

For GitHub Actions builds, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Settings > Secrets and variables > Actions > Secrets**, then expose them to the build step as environment variables. This repository does not currently include a deployment workflow.

These `VITE_` values are included in the client-side bundle and are visible to anyone using the app. The Supabase anon key is intended to be public; never use a service-role key here. Protect data with Supabase Row Level Security policies.

If a sensitive key was committed previously, removing `.env` from the current commit does not remove it from Git history; rotate any truly secret credentials.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
