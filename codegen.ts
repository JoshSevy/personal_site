import type { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  overwrite: true,
  schema: "src/app/graphql/schema.graphql",
  documents: ["src/**/*.ts", "src/**/*.html"],
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
