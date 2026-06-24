const net = require('net');

const host = 'aws-1-eu-central-1.pooler.supabase.com';
const port = 6543;

const client = new net.Socket();
client.setTimeout(5000);

console.log(`Attempting to connect to ${host}:${port}...`);

client.connect(port, host, () => {
    console.log('✅ Connection SUCCESSFUL!');
    client.destroy();
});

client.on('error', (err) => {
    console.error('❌ Connection FAILED:', err.message);
    client.destroy();
});

client.on('timeout', () => {
    console.error('❌ Connection TIMED OUT');
    client.destroy();
});
