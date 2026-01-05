/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
require('dotenv').config();

console.log('Current directory:', process.cwd());
console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL prefix:', process.env.DATABASE_URL.substring(0, 15));
    if (process.env.DATABASE_URL.includes('YOUR_PASSWORD')) {
        console.error('ERROR: DATABASE_URL contains placeholder password "YOUR_PASSWORD"');
    }
}

try {
    console.log('Running prisma db push...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
} catch (error) {
    console.error('Failed to run prisma db push');
    if (error.stdout) console.log('Stdout:', error.stdout.toString());
    if (error.stderr) console.error('Stderr:', error.stderr.toString());
    process.exit(1);
}
