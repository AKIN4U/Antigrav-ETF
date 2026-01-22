require('dotenv').config();
const dbUrl = process.env.DATABASE_URL || '';
const match = dbUrl.match(/:(\d+)\//);
if (match) {
    console.log('DATABASE_URL port:', match[1]);
} else {
    console.log('DATABASE_URL port not found');
}
