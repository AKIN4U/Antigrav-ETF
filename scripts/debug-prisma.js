require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('Environment check:');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    const prisma = new PrismaClient();

    try {
        console.log('Attempting to connect...');
        await prisma.$connect();
        console.log('Connected successfully!');

        const count = await prisma.application.count();
        console.log('Count successful:', count);
    } catch (e) {
        console.error('FULL ERROR OBJECT:');
        console.error(JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
    } finally {
        await prisma.$disconnect();
    }
}

main();
