import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (!req.nextauth || !req.nextauth.token) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    const { pathname } = req.nextUrl;
    const { role } = req.nextauth.token;

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    if (pathname.startsWith("/user") && role !== "user") {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    if (pathname.startsWith("/manager") && role !== "manager") {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorised: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/admin",
    "/user",
    "/manager",
    "/role-redirect",
    "/api/Clients",
    "/api/LogMessages",
    "/api/Projects",
    "/api/Tasks",
    "/api/Timesheets",
    "/api/Users",
  ],
};
