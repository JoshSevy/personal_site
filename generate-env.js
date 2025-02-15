const fs = require('fs');
const dotenv = require('dotenv');

// Load the .env file
const envConfig = dotenv.config().parsed;

if (!envConfig) {
  console.error('Error: .env file is missing or empty. Cannot generate environment files.');
  process.exit(1);
}

// Helper function to generate environment file content
const generateEnvContent = (production) => `
export const environment = {
  production: ${production},
  MDC_KEY: '${envConfig.MDC_KEY || 'no_key_found'}',
};
`;

// Generate and write environment.ts (development)
const devPath = './src/environments/environment.ts';
fs.writeFileSync(devPath, generateEnvContent(false));
console.log(`✅ Generated: ${devPath}`);

// Generate and write environment.prod.ts (production)
const prodPath = './src/environments/environment.prod.ts';
fs.writeFileSync(prodPath, generateEnvContent(true));
console.log(`✅ Generated: ${prodPath}`);
