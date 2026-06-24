const { Client } = require('pg');

const connectionString = 'postgresql://postgres.meszezrqfjemgclbbwxq:Obafemi29%23@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

async function testConnection() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false // Supabase usually requires SSL
        }
    });

    try {
        console.log('Attempting to connect with pg client...');
        await client.connect();
        console.log('✅ Connection SUCCESSFUL!');

        const res = await client.query('SELECT current_database(), current_user');
        console.log('Result:', res.rows[0]);

    } catch (err) {
        console.error('❌ Connection FAILED:', err.message);
        console.error('Full error:', err);
    } finally {
        await client.end();
    }
}

testConnection();
