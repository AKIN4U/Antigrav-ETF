import { prisma } from "./prisma";
import { createClient } from "./supabase/server";

interface AuditLogParams {
    action: string;
    details?: string;
    userId?: string;
    userEmail?: string;
    ipAddress?: string; // Optional, can be grabbed from headers if passed
}

export async function createAuditLog({ action, details, userId, userEmail }: AuditLogParams) {
    try {
        // If user info is missing, try to grab from current session
        if (!userId || !userEmail) {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                userId = userId || user.id;
                userEmail = userEmail || user.email;
            }
        }

        await prisma.auditLog.create({
            data: {
                action,
                details,
                userId,
                userEmail,
            }
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // Don't crash the main app flow if logging fails
    }
}
