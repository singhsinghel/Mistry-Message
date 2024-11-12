import { NextRequest, NextResponse } from "next/server";

//default will set middleware to all pages
export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  //if token available means user alreaady logged in. So no neeed to access these routes
  if (token) {
    if (
      url.pathname === "/sign-up" ||
      url.pathname === "/sign-in" ||
      url.pathname === "/verify"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

// Defines on which path the middleware has to run
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*", //all the child paths of dashboard
    "/verify/:path*",
  ],
};
