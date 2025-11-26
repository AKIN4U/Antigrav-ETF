import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protect Admin Routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
        // Exclude the login page itself from the check to avoid redirect loops
        if (req.nextUrl.pathname === "/admin/login") {
            // Optional: If already logged in, redirect to admin dashboard
            if (session) {
                return NextResponse.redirect(new URL("/admin/applications", req.url));
            }
            // If not logged in, allow access to login page
            return res;
        }

        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        // Check if user is an admin
        // Note: In a real production app, you might want to cache this or use custom claims
        // to avoid a DB hit on every request. For now, this is secure and simple.
        const { data: adminUser } = await supabase
            .from("AdminUser")
            .select("role")
            .eq("email", session.user.email)
            .single();

        if (!adminUser) {
            // User is logged in but not an admin
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Protect Application Routes
    if (req.nextUrl.pathname.startsWith("/apply") && req.nextUrl.pathname !== "/apply") {
        // Allow /apply (landing) but protect /apply/form etc
        // Actually, let's protect /apply/form specifically
        if (req.nextUrl.pathname.startsWith("/apply/form")) {
            if (!session) {
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }
    }

    return res;
}

export const config = {
    matcher: ["/admin/:path*", "/apply/:path*"],
};
