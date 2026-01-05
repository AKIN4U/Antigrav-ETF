import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get current admin user
        const { data: currentAdmin } = await supabase
            .from("AdminUser")
            .select("id, role")
            .eq("email", session.user.email)
            .single();

        if (!currentAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch assessments for this application
        const { data: assessments, error } = await supabase
            .from("Assessment")
            .select("*, adminUser:AdminUser(name, email)")
            .eq("applicationId", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ assessments });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
