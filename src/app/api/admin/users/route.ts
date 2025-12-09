import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Initialize Supabase Admin Client for Admin Auth Operations
// This requires SUPABASE_SERVICE_ROLE_KEY to be set in environment variables
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || "", // Use empty string to avoid immediate crash
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

// Helper to check for configuration
function checkConfig() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
    }
}

// GET - List all admin users
export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        // Check if user is authenticated
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!session.user?.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 401 });
        }

        // Verify SuperAdmin role
        const { data: currentAdmin } = await supabase
            .from("AdminUser")
            .select("role")
            .eq("email", session.user.email)
            .single();

        if (!currentAdmin || currentAdmin.role !== "SuperAdmin") {
            return NextResponse.json(
                { error: "Forbidden - SuperAdmin access required" },
                { status: 403 }
            );
        }

        // Get all admin users
        const { data: adminUsers, error } = await supabase
            .from("AdminUser")
            .select("*")
            .order("createdAt", { ascending: false });

        if (error) {
            console.error("Error fetching admin users:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get Supabase Auth users to check if accounts are active
        // Use supabaseAdmin because listUsers requires service_role permissions
        const { data: authUsers, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();

        if (listUsersError) {
            console.error("Error fetching auth users:", listUsersError);
            // We continue, but status might be inaccurate
        }

        // Merge data to show account status
        const usersWithStatus = adminUsers.map((admin: any) => {
            const authUser = authUsers?.users?.find((u: any) => u.email === admin.email);
            return {
                ...admin,
                isActive: !!authUser,
                lastSignIn: authUser?.last_sign_in_at || null,
            };
        });

        return NextResponse.json({ users: usersWithStatus });
    } catch (error: any) {
        console.error("Error in GET /api/admin/users:", error);
        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}

// POST - Create new admin user
export async function POST(req: NextRequest) {
    try {
        checkConfig();

        // Handle cookie store explicitly
        let supabase;
        try {
            const cookieStore = await cookies();
            supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        } catch (e) {
            console.error("Cookie store error:", e);
            return NextResponse.json({ error: "Configuration Error: Cookie store unavailable" }, { status: 500 });
        }

        // Check if user is authenticated
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!session.user?.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 401 });
        }

        // Verify SuperAdmin role
        const { data: currentAdmin } = await supabase
            .from("AdminUser")
            .select("role")
            .eq("email", session.user.email)
            .single();

        if (!currentAdmin || currentAdmin.role !== "SuperAdmin") {
            return NextResponse.json(
                { error: "Forbidden - SuperAdmin access required" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { email, name, role, password } = body;

        // Validate input
        if (!email || !name || !role || !password) {
            return NextResponse.json(
                { error: "Email, name, role, and password are required" },
                { status: 400 }
            );
        }

        if (!["Admin", "SuperAdmin"].includes(role)) {
            return NextResponse.json(
                { error: "Role must be either 'Admin' or 'SuperAdmin'" },
                { status: 400 }
            );
        }

        // Check if user already exists in AdminUser table
        const { data: existingAdmin } = await supabase
            .from("AdminUser")
            .select("id")
            .eq("email", email)
            .single();

        if (existingAdmin) {
            return NextResponse.json(
                { error: "Admin user with this email already exists" },
                { status: 409 }
            );
        }

        // Create Supabase Auth user
        // Use supabaseAdmin for privileged creation
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                name,
                role,
            },
        });

        if (authError) {
            console.error("Error creating auth user:", authError);
            return NextResponse.json(
                { error: `Failed to create auth user: ${authError.message}` },
                { status: 500 }
            );
        }

        // Add to AdminUser table
        const { data: newAdmin, error: dbError } = await supabase
            .from("AdminUser")
            .insert({
                email,
                name,
                role,
            })
            .select()
            .single();

        if (dbError) {
            console.error("Error creating admin user in database:", dbError);
            // Rollback: Delete the auth user
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            return NextResponse.json(
                { error: `Failed to create admin user: ${dbError.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "Admin user created successfully",
                user: newAdmin,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error in POST /api/admin/users:", error);
        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}

// PATCH - Update admin user role
export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        // Check if user is authenticated
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!session.user?.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 401 });
        }

        // Verify SuperAdmin role
        const { data: currentAdmin } = await supabase
            .from("AdminUser")
            .select("role")
            .eq("email", session.user.email)
            .single();

        if (!currentAdmin || currentAdmin.role !== "SuperAdmin") {
            return NextResponse.json(
                { error: "Forbidden - SuperAdmin access required" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { id, role, name } = body;

        if (!id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        if (role && !["Admin", "SuperAdmin"].includes(role)) {
            return NextResponse.json(
                { error: "Role must be either 'Admin' or 'SuperAdmin'" },
                { status: 400 }
            );
        }

        // Update AdminUser table
        const updateData: any = {};
        if (role) updateData.role = role;
        if (name) updateData.name = name;

        const { data: updatedAdmin, error } = await supabase
            .from("AdminUser")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating admin user:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Admin user updated successfully",
            user: updatedAdmin,
        });
    } catch (error: any) {
        console.error("Error in PATCH /api/admin/users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Deactivate admin user
export async function DELETE(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        // Check if user is authenticated
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!session.user?.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 401 });
        }

        // Verify SuperAdmin role
        const { data: currentAdmin } = await supabase
            .from("AdminUser")
            .select("role, email")
            .eq("email", session.user.email)
            .single();

        if (!currentAdmin || currentAdmin.role !== "SuperAdmin") {
            return NextResponse.json(
                { error: "Forbidden - SuperAdmin access required" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Get the admin user to delete
        const { data: adminToDelete } = await supabase
            .from("AdminUser")
            .select("email")
            .eq("id", userId)
            .single();

        if (!adminToDelete) {
            return NextResponse.json(
                { error: "Admin user not found" },
                { status: 404 }
            );
        }

        // Prevent self-deletion
        if (adminToDelete.email === currentAdmin.email) {
            return NextResponse.json(
                { error: "Cannot delete your own account" },
                { status: 400 }
            );
        }

        // Get the auth user ID
        // Use supabaseAdmin
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
        const authUser = authUsers?.users?.find((u: any) => u.email === adminToDelete.email);

        // Delete from AdminUser table
        const { error: dbError } = await supabase
            .from("AdminUser")
            .delete()
            .eq("id", userId);

        if (dbError) {
            console.error("Error deleting admin user from database:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // Delete from Supabase Auth if exists
        // Use supabaseAdmin
        if (authUser) {
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUser.id);
            if (authError) {
                console.error("Error deleting auth user:", authError);
                // Don't fail the request if auth deletion fails
            }
        }

        return NextResponse.json({
            message: "Admin user deactivated successfully",
        });
    } catch (error: any) {
        console.error("Error in DELETE /api/admin/users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
