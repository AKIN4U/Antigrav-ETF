require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const dbUrl = process.env.DATABASE_URL || 'NOT SET';
        console.log('DATABASE_URL starts with:', dbUrl.substring(0, 20) + '...');

        const count = await prisma.application.count();
        console.log('Total applications count:', count);

        const applications = await prisma.application.findMany({
            take: 2,
            include: {
                applicant: true
            }
        });
        console.log('Sample applications:', JSON.stringify(applications, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
