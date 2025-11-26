import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch financial overview
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

        // Get budgets for the year
        const budgets = await prisma.budget.findMany({
            where: { year },
            include: {
                transactions: true
            },
            orderBy: [
                { quarter: 'asc' },
                { category: 'asc' }
            ]
        });

        // Get all transactions for the year
        const transactions = await prisma.transaction.findMany({
            where: {
                date: {
                    gte: new Date(`${year}-01-01`),
                    lte: new Date(`${year}-12-31`)
                }
            },
            orderBy: {
                date: 'desc'
            },
            take: 100
        });

        // Calculate summary
        const totalBudget = budgets.reduce((sum, b) => sum + Number(b.allocated), 0);
        const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0);
        const totalIncome = transactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpenses = transactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return NextResponse.json({
            success: true,
            data: {
                budgets,
                transactions,
                summary: {
                    totalBudget,
                    totalSpent,
                    totalIncome,
                    totalExpenses,
                    balance: totalIncome - totalExpenses,
                    budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
                }
            }
        });
    } catch (error) {
        console.error("Error fetching financial data:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch financial data" }, { status: 500 });
    }
}

// POST - Create budget or transaction
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, ...data } = body;

        if (type === 'budget') {
            const budget = await prisma.budget.create({
                data: {
                    year: data.year,
                    quarter: data.quarter || null,
                    category: data.category,
                    allocated: new Prisma.Decimal(data.allocated),
                    description: data.description
                }
            });
            return NextResponse.json({ success: true, data: budget });
        } else if (type === 'transaction') {
            const transaction = await prisma.transaction.create({
                data: {
                    budgetId: data.budgetId || null,
                    type: data.transactionType,
                    category: data.category,
                    amount: new Prisma.Decimal(data.amount),
                    description: data.description,
                    reference: data.reference,
                    date: new Date(data.date),
                    createdBy: data.createdBy
                }
            });

            // Update budget spent amount if linked
            if (data.budgetId && data.transactionType === 'Expense') {
                await prisma.budget.update({
                    where: { id: data.budgetId },
                    data: {
                        spent: {
                            increment: new Prisma.Decimal(data.amount)
                        }
                    }
                });
            }

            return NextResponse.json({ success: true, data: transaction });
        }

        return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
    } catch (error) {
        console.error("Error creating financial record:", error);
        return NextResponse.json({ success: false, error: "Failed to create record" }, { status: 500 });
    }
}
