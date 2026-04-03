import type { CodegenConfig } from '@graphql-codegen/cli';

// Default: committed SDL for offline/CI. Set GRAPHQL_SCHEMA_URL to introspect a live endpoint (local or production).
const schema = process.env['GRAPHQL_SCHEMA_URL'] ?? 'src/app/graphql/schema.graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema,
  documents: ["src/app/graphql/**/*.graphql", "src/**/*.ts", "src/**/*.html"],
  generates: {
    "src/app/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-apollo-angular"
      ],
      config: {
        addExplicitOverride: true,
        typesPrefix: 'GQL',
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        serviceName: 'GraphQLService',
        serviceProvidedInRoot: true,
      }
    }
  }
};
export default config;
