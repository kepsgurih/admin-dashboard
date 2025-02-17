import authConfig from "./lib/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const {auth} = NextAuth(authConfig)

export default auth(async function middleware(req: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session;

  if(req.nextUrl.pathname.startsWith('/apps') && !isAuthenticated){
    return NextResponse.redirect(new URL('/', req.url))
  }

  if(req.nextUrl.pathname === '/' && isAuthenticated){
    return NextResponse.redirect(new URL('/apps', req.url))
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}