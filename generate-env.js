const fs = require('fs');
const path = require('path');

// Use dotenv only if not running on Vercel
if (!process.env['VERCEL']) {
  require('dotenv').config();
}

// Define the environment variables
const environmentFileContent = `
export const environment = {
  production: ${process.env['NODE_ENV'] === 'production'},
  mdcKey: "${process.env['MDC_KEY'] || ''}",
  superbaseUrl: "${process.env['SUPABASE_URL'] || ''}",
  superbaseKey: "${process.env['SUPABASE_ANON_KEY'] || ''}",
  appVersion: "${process.env['APP_VERSION'] || '1.0.0'}",
};
`;

// Ensure the environments directory exists
const environmentsDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir, {recursive: true});
}

// Write the environment.ts file
const targetPath = path.join(environmentsDir, 'environment.ts');
fs.writeFileSync(targetPath, environmentFileContent);

console.log(`✅ Successfully generated environment.ts at ${targetPath}`);
