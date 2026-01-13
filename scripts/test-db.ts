import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.application.count()
        console.log('Total applications count:', count)

        const applications = await prisma.application.findMany({
            take: 5,
            include: {
                applicant: true
            }
        })
        console.log('First 5 applications with applicants:', JSON.stringify(applications, null, 2))
    } catch (error) {
        console.error('Error connecting to database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
