import type { CodegenConfig } from '@graphql-codegen/cli';

// Introspects the API and overwrites src/app/graphql/schema.graphql. Defaults to production; override with GRAPHQL_SCHEMA_URL.
const schema = process.env['GRAPHQL_SCHEMA_URL'] ?? 'https://api.joshuasevy.com/graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema,
  generates: {
    "src/app/graphql/schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
};
export default config;
