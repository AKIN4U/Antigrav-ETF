import { Database } from './supabase';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Basic Table Types
export type AdminUser = Tables<'AdminUser'>;
export type Applicant = Tables<'Applicant'>;
export type Application = Tables<'Application'>;
export type Budget = Tables<'Budget'>;
export type Donation = Tables<'Donation'>;
export type FamilyInfo = Tables<'FamilyInfo'>;
export type Transaction = Tables<'Transaction'>;

// Extended Types (Joined Data)
export interface ApplicationWithApplicant extends Application {
    applicant: Applicant;
}

export interface TransactionWithBudget extends Transaction {
    budget?: Budget | null;
}

export interface DonationWithTransaction extends Donation {
    transaction: Transaction;
}

export interface ApplicantWithFamily extends Applicant {
    familyInfo?: FamilyInfo | null;
}

export interface ApplicationDetail extends Application {
    applicant: ApplicantWithFamily;
}

// Dashboard Data Types
export interface DonationResponse {
    summary: {
        totalDonations: number;
        totalDonors: number;
        averageDonation: number;
        receiptsIssued: number;
    };
    donations: DonationWithTransaction[];
    typeBreakdown: Record<string, number>;
    purposeBreakdown: Record<string, number>;
    monthlyData: { month: string; amount: number; count: number }[];
    topDonors: { name: string; count: number; amount: number }[];
}

export interface ReportResponse {
    summary: {
        totalApplications: number;
        totalDisbursed: number;
        averageAmount: number;
        approvalRate: number;
    };
    statusBreakdown: Record<string, number>;
    genderBreakdown: Record<string, number>;
    levelBreakdown: Record<string, number>;
    monthlyData: { month: string; applications: number }[];
    topSchools: { name: string; count: number; amount: number }[];
}

export interface FinanceResponse {
    summary: {
        totalBudget: number;
        totalIncome: number;
        totalExpenses: number;
        balance: number;
    };
    budgets: Budget[];
    transactions: Transaction[];
}

// API Response Wrappers
export interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    error?: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
