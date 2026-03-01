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

// GET - List assessments for the current user (if Committee) or all (if SuperAdmin)
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get current admin user
        const { data: currentAdmin } = await (supabase as any)
            .from("AdminUser")
            .select("id, role")
            .eq("email", session.user.email)
            .single();

        if (!currentAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const url = new URL(req.url);
        const applicationId = url.searchParams.get("applicationId");

        let query = (supabase as any).from("Assessment").select(`
            *,
            application:Application(id, applicant:Applicant(firstName, surname, middleName)),
            adminUser:AdminUser(name, email)
        `);

        // Filter by application if provided
        if (applicationId) {
            query = query.eq("applicationId", applicationId);
        }

        // If not SuperAdmin, only show own assessments
        if (currentAdmin.role !== "SuperAdmin") {
            query = query.eq("adminUserId", currentAdmin.id);
        }

        const { data: assessments, error } = await query;

        if (error) {
            console.error("Error fetching assessments:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ assessments });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create or Update Assessment
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: currentAdmin } = await (supabase as any)
            .from("AdminUser")
            .select("id, role")
            .eq("email", session.user.email)
            .single();

        if (!currentAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { applicationId, financialScore, academicScore, churchScore, notes } = body;

        if (!applicationId) {
            return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
        }

        // Calculate total score
        const totalScore = (financialScore || 0) + (academicScore || 0) + (churchScore || 0);

        // Upsert assessment
        const { data, error } = await (supabase as any)
            .from("Assessment")
            .upsert({
                applicationId,
                adminUserId: currentAdmin.id,
                financialScore: financialScore || 0,
                academicScore: academicScore || 0,
                churchScore: churchScore || 0,
                totalScore,
                notes,
            }, {
                onConflict: "applicationId,adminUserId"
            })
            .select()
            .single();

        if (error) {
            console.error("Error saving assessment:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ assessment: data });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
