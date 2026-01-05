/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const email = process.argv[2];

if (!email) {
    console.log('Please provide an email address: node scripts/make-superadmin.js <email>');
    process.exit(1);
}

async function main() {
    console.log(`Promoting ${email} to SuperAdmin...`);

    // Check if user exists
    const user = await prisma.adminUser.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`User ${email} not found in AdminUser table.`);
        // Optionally create them?
        console.log('Creating new AdminUser...');
        await prisma.adminUser.create({
            data: {
                email,
                role: 'SuperAdmin',
                name: 'SuperAdmin (Script)',
            },
        });
        console.log('Created and set to SuperAdmin.');
    } else {
        await prisma.adminUser.update({
            where: { email },
            data: { role: 'SuperAdmin' },
        });
        console.log(`User ${email} updated to SuperAdmin.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
