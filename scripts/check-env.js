/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
console.log(`Checking for .env at: ${envPath}`);

if (fs.existsSync(envPath)) {
    console.log('.env file exists.');
    const result = dotenv.config({ path: envPath });

    if (result.error) {
        console.error('Error loading .env file:', result.error);
    } else {
        console.log('.env loaded successfully.');
        const dbUrl = process.env.DATABASE_URL;
        if (dbUrl) {
            console.log('DATABASE_URL is PRESENT.');
            // Check if it looks valid-ish (starts with postgres:// or postgresql://)
            if (dbUrl.startsWith('postgres')) {
                console.log('DATABASE_URL format looks correct (starts with postgres...).');
            } else {
                console.log('WARNING: DATABASE_URL does not start with "postgres".');
            }
        } else {
            console.error('ERROR: DATABASE_URL is MISSING from .env.');
        }
    }
} else {
    console.error('ERROR: .env file NOT found at expected path.');
}
