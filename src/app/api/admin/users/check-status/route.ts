import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper to create a Supabase client ensuring async cookies are handled
async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle server action/component restrictions
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: "", ...options });
                    } catch (error) {
                        // Handle server action/component restrictions
                    }
                },
            },
        }
    );
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();

        // Check if user is authenticated
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { approved: false, status: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check AdminUser status
        const { data: adminUser } = await supabase
            .from("AdminUser")
            .select("status")
            .eq("email", session.user.email)
            .single();

        if (!adminUser) {
            return NextResponse.json(
                { approved: false, status: "Not Found" },
                { status: 403 }
            );
        }

        if (adminUser.status !== "Approved") {
            return NextResponse.json(
                { approved: false, status: adminUser.status },
                { status: 403 }
            );
        }

        return NextResponse.json({ approved: true, status: "Approved" });
    } catch (error: any) {
        console.error("Error checking user status:", error);
        return NextResponse.json(
            { approved: false, status: "Error" },
            { status: 500 }
        );
    }
}
