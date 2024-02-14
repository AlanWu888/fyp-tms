import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // console.log(req.nextUrl.pathname);
    // console.log(req.nextauth.token.role);

    // if (
    //   req.nextUrl.pathname.startsWith("/admin") &&
    //   req.nextauth.token.role != "admin"
    // ) {
    //   return NextResponse.rewrite(new URL("/Denied", req.url));
    // }

    if (
      req.nextUrl.pathname.startsWith("/user") &&
      req.nextauth.token.role != "user"
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/manager") &&
      req.nextauth.token.role != "manager"
    ) {
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
  matcher: ["/admin", "/user", "/manager", "/role-redirect"],
};
