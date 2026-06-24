const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function main() {
    const url = process.argv[2];
    if (!url) {
        console.error('Usage: node apply-migration.js <DATABASE_URL>');
        process.exit(1);
    }

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url.includes('?') ? `${url}&sslmode=require` : `${url}?sslmode=require`
            }
        }
    });

    try {
        console.log('Reading migration_new.sql...');
        const sqlPath = path.resolve(__dirname, '../migration_new.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Attempting to execute migration...');
        // We use $executeRawUnsafe to run the entire script. 
        // Note: Some Postgres drivers might require splitting by semicolon if they don't support multi-statement queries.
        // Prisma usually handles multi-statement strings if the underlying driver does.
        await prisma.$executeRawUnsafe(sql);

        console.log('Migration applied successfully! 🎉');
    } catch (error) {
        console.error('Error applying migration:');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
