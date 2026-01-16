module.exports = {
  client: {
    service: {
      name: 'personal-site-local',
      localSchemaFile: './src/app/graphql/schema.graphql'
    },
    includes: ['src/**/*.ts', 'src/**/*.html']
  }
};

