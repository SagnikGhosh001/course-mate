import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
// Skip NextAuth API routes
if (url.pathname.startsWith("/api/auth")) {
  return NextResponse.next();
}
  if (!token && (url.pathname.startsWith("/user") || url.pathname.startsWith("/course") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/creator"))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    token &&
    (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in","/admin/:path*", "/sign-up", "/", "/user/:path*", "/creator/:path*","/course/:path*", "/verify/:path*,/about,/services,/contact","/not-found"],
};
