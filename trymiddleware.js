// middleware.js
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const STAFF_ROLES = ["ADMIN", "MANAGER", "SUPERVISOR", "BARISTA"];

export async function middleware(req) {
    // NextResponse.next() lets us set/read cookies
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Grab the current session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protect all /admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
        // 1) Not logged in → redirect to login
        if (!session) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = "/login";
            return NextResponse.redirect(loginUrl);
        }

        // 2) Fetch this user’s role from your User table
        const { data: profile, error } = await supabase
            .from("User")           // change to "users" if that’s your table name
            .select("role(name)")
            .eq("id", session.user.id)
            .single();

        // 3) If no profile, or role isn’t in STAFF_ROLES → redirect home
        if (
            error ||
            !profile?.role?.name ||
            !STAFF_ROLES.includes(profile.role.name)
        ) {
            const homeUrl = req.nextUrl.clone();
            homeUrl.pathname = "/";
            return NextResponse.redirect(homeUrl);
        }
    }

    return res;
}

export const config = {
    matcher: ["/admin/:path*"],
};
