// import { NextResponse } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// export async function middleware(req) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req, res });

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const url = req.nextUrl.clone();
//   const isAdminRoute = url.pathname.startsWith("/admin");

//   if (!isAdminRoute) return res; // ✅ Only run logic for /admin

//   if (!session) {
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   const userId = session.user.id;

//   // 🔐 Fetch user role
//   const userRes = await fetch(`${url.origin}/api/user/${userId}`);
//   const user = await userRes.json();
//   const role = user?.role?.name;
//   const allowedRoles = ["ADMIN", "MANAGER", "SUPERVISOR"];

//   // 🚫 Not a staff member
//   if (!allowedRoles.includes(role)) {
//     url.pathname = "/not-authorized";
//     return NextResponse.redirect(url);
//   }

//   // 🧠 Check for verification cookie
//   const verified = req.cookies.get("staff_verified");
//   if (!verified) {
//     url.pathname = "/admin-verify";
//     return NextResponse.redirect(url);
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };
