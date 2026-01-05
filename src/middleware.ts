import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Check for environment variables to prevent build-time crashes
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase environment variables missing in middleware");
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set({ name, value, ...options });
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        response.cookies.set({ name, value, ...options });
                    });
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // Exclude /admin/login from protection
        if (request.nextUrl.pathname === "/admin/login") {
            // Optional: If already logged in, redirect to admin dashboard
            if (session) {
                return NextResponse.redirect(new URL("/admin/applications", request.url));
            }
            return response;
        }

        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Optional: Check if user is actually an admin using Supabase RPC or metadata if available in session
        // For now, simple auth check is better than nothing, role check happens in page/layout/api
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
