import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Initialize Supabase Admin Client for Privileged Ops
const getSupabaseAdmin = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
};

// Helper to check for configuration
function checkConfig() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
    }
}

export async function POST(req: NextRequest) {
    try {
        checkConfig();
        const body = await req.json();
        const { email, name, password } = body;

        // Basic validation
        if (!email || !name || !password) {
            return NextResponse.json(
                { error: "Email, name, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Initialize Admin Client
        const supabaseAdmin = getSupabaseAdmin();

        // 1. Check if user already exists in AdminUser table
        const { data: existingAdmin } = await (supabaseAdmin as any)
            .from("AdminUser")
            .select("id")
            .eq("email", email)
            .single();

        if (existingAdmin) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // 2. Create Supabase Auth User
        // We set email_confirm to true for simplicity, but mark 'status' as Pending in our DB
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name,
                role: "Committee",
            },
        });

        if (authError) {
            console.error("Error creating auth user:", authError);
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        // 3. Create AdminUser entry with "Pending" status
        const { error: dbError } = await supabaseAdmin
            .from("AdminUser")
            .insert({
                email,
                name,
                role: "Committee",
                status: "Pending", // Explicitly pending
            } as any);

        if (dbError) {
            console.error("Error creating database entry:", dbError);
            // Rollback: Delete the auth user
            if (authUser.user) {
                await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            }
            return NextResponse.json(
                { error: "Failed to create account profile. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Registration successful. Pending approval." },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error in registration:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
