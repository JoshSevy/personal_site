const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Load the .env file
const envConfig = dotenv.config().parsed;

if (!envConfig) {
  console.error('Error: .env file is missing or empty. Cannot generate environment files.');
  process.exit(1);
}

// Define paths
const envDir = path.join(__dirname, 'src', 'environments');

// Ensure the `src/environments` directory exists
if (!fs.existsSync(envDir)) {
  console.log(`Creating directory: ${envDir}`);
  fs.mkdirSync(envDir, { recursive: true });
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

