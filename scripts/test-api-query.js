require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        // Mocking API parameters
        const page = 1;
        const limit = 10;
        const status = "All";
        const search = ""; // Empty string like the frontend might send

        const skip = (page - 1) * limit;
        const where = {};

        if (status && status !== "All") {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { applicant: { firstName: { contains: search, mode: "insensitive" } } },
                { applicant: { surname: { contains: search, mode: "insensitive" } } },
                { schoolName: { contains: search, mode: "insensitive" } },
            ];
        }

        console.log('Query where clause:', JSON.stringify(where));

        const [total, applications] = await Promise.all([
            prisma.application.count({ where }),
            prisma.application.findMany({
                where,
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
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit,
            })
        ]);

        console.log(`Total count: ${total}`);
        console.log(`Applications returned: ${applications.length}`);
        if (applications.length > 0) {
            console.log('First application applicant:', JSON.stringify(applications[0].applicant, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
