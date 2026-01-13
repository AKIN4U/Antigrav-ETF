require('dotenv').config();
const dbUrl = process.env.DATABASE_URL || '';
const match = dbUrl.match(/@([^/:]+)/);
if (match) {
    console.log('DATABASE_URL host:', match[1]);
} else {
    console.log('DATABASE_URL host not found or URL malformed');
}
