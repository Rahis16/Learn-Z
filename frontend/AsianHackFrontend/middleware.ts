import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-pass",
  "/change-pass",
  "/login/loading",
  "/github-callback",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("⚡ Middleware triggered for:", pathname);

  if (PUBLIC_ROUTES.includes(pathname)) {
    console.log("✅ Public route allowed:", pathname);
    return NextResponse.next();
  }
  const rawStatusBase64 = request.cookies.get("user_status")?.value;

  if (!rawStatusBase64) {
    console.log("⛔ No cookie — redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let userStatus;

  try {
    const jsonString = Buffer.from(rawStatusBase64, "base64").toString("utf-8");
    userStatus = JSON.parse(jsonString); // ✅ This was missing in your log
    console.log("✅ Parsed user status:", userStatus);
  } catch (err) {
    console.log("❌ Failed to parse cookie:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!userStatus.is_authenticated) {
    console.log("⛔ Not authenticated — redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }
 
  if (pathname.startsWith("/admin") && !userStatus.is_superuser) {
    console.log("⛔ Not a superuser — redirecting to /unauthorized");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  console.log("✅ Access granted — proceeding");
  return NextResponse.next();
}

// ✅ THIS is where matcher goes
export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*).*)"],
};
