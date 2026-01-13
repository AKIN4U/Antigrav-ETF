require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Starting count query...');
        const count = await prisma.application.count();
        console.log('Total count:', count);

        console.log('Starting findMany query...');
        const applications = await prisma.application.findMany({
            include: {
                applicant: {
                    select: {
                        firstName: true,
                        surname: true,
                        email: true,
                        phone: true,
                    }
                }
            },
            take: 10
        });
        console.log('Applications found:', applications.length);
        if (applications.length > 0) {
            console.log('Data sample:', JSON.stringify(applications[0], null, 2));
        }

    } catch (error) {
        console.error('ERROR during query:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
