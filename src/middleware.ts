import { NextRequest, NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//default will set middleware to all pages
export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  //if token available means user alreaady logged in. So no neeed to access these routes
  if (
    token &&
    (url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if(!token&& url.pathname.startsWith("/dashboard"))
    return NextResponse.redirect(new URL("/sign-in",request.url))
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
