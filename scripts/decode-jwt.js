const jwt = require('jsonwebtoken');

const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lc3plenJxZmplbWdjbGJid3hxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkxMTA3OSwiZXhwIjoyMDc5NDg3MDc5fQ.n7KdHUCxvJmtt6uLfjNSzLBTz2HfxRifIWk-PaH_5d0';

try {
    const decoded = jwt.decode(key);
    console.log('Decoded JWT:', JSON.stringify(decoded, null, 2));
} catch (e) {
    // If jsonwebtoken is not installed, try manual base64 decode of the middle part
    console.log('Manual decode:');
    const parts = key.split('.');
    if (parts.length > 1) {
        const payload = Buffer.from(parts[1], 'base64').toString();
        console.log('Payload:', payload);
    }
}
