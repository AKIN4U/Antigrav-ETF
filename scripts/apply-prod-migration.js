const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function main() {
    // Hardcoding the URL to avoid shell escaping issues
    const url = 'postgresql://postgres.meszezrqfjemgclbbwxq:Obafemi29%23@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require';

    console.log('Testing connection with hardcoded URL...');
    console.log('Host: aws-1-eu-central-1.pooler.supabase.com:5432');
    console.log('User: postgres.meszezrqfjemgclbbwxq');

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    });

    try {
        console.log('Attempting to connect...');
        await prisma.$connect();
        console.log('✅ Connected successfully!');

        console.log('Reading migration_new.sql...');
        const sqlPath = path.resolve(__dirname, '../migration_new.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing migration...');
        await prisma.$executeRawUnsafe(sql);
        console.log('🚀 Migration applied successfully!');

    } catch (error) {
        console.error('❌ Error:');
        console.error(error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
